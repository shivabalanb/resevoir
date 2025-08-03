import {
  ethers,
  JsonRpcProvider,
  keccak256,
  NonceManager,
  parseEther,
  randomBytes,
} from "ethers";
import { config, configN, fromEnv } from "../config";
import { Resolver } from "../../resolver";
import { MOCK__factory as MOCK } from "../../types";
import { Wallet } from "../../wallet";
import {
  Address,
  AmountMode,
  AuctionDetails,
  CrossChainOrder,
  HashLock,
  randBigInt,
  TakerTraits,
  TimeLocks,
  EscrowFactory as OneEscrowFactory,
  Immutables,
} from "@1inch/cross-chain-sdk";
import { uint8ArrayToHex, UINT_40_MAX } from "@1inch/byte-utils";
import { parseNearAmount } from "@near-js/utils";
import { EscrowFactory } from "../../escrow-factory";
import { deployNearEscrow } from "../near";
import { Account } from "@near-js/accounts";
import {
  JsonRpcProvider as NearJsonRpcProvider,
  Provider,
} from "@near-js/providers";
import { actionCreators } from "@near-js/transactions";
import { KeyPair } from "@near-js/crypto";

const provider = new JsonRpcProvider(config.src.url);
const nearProvider = new NearJsonRpcProvider({ url: config.dst.url });

export async function fundAndApprove(
  userWallet: Wallet,
  resolverWallet: Wallet
) {
  console.log("--- Funding and approving assets...");

  // --- 1. User Setup ---
  // Transaction 1: Have user approve LOP
  await userWallet.approveToken(
    config.src.tokens.MOCK,
    config.src.limitOrderProtocol,
    ethers.MaxUint256
  );
  console.log(`- User (${await userWallet.getAddress()}) approved LOP.`);

  // --- 2. Resolver Setup ---
  let nonceManagedSigner = new NonceManager(resolverWallet.signer);

  // Transaction 1: Fund the contract with ETH
  const resolverContract = new Resolver(config.src.resolverContract);
  let tx1 = await nonceManagedSigner.sendTransaction({
    to: resolverContract.srcAddress,
    value: parseEther("10"),
  });
  await tx1.wait();
  console.log(`- Funded contract with ETH.`);

  // Transaction 2: Mint MOCK tokens to the contract
  const fundAmount = parseEther("1000");
  const mockContract = MOCK.connect(config.src.tokens.MOCK);
  let tx2 = await mockContract
    .connect(nonceManagedSigner)
    .mint(resolverContract.srcAddress, fundAmount);
  await tx2.wait();
  console.log(`- Minted MOCK tokens.`);

  // Transaction 3: Have the contract approve the factory
  const approveTxRequest = resolverContract.executeApprove(
    config.src.tokens.MOCK,
    config.src.escrowFactory,
    ethers.MaxUint256
  );
  let tx3 = await nonceManagedSigner.sendTransaction(approveTxRequest);
  await tx3.wait();
  console.log(`- Approved escrow factory.`);
}

export async function createSignedOrder(signer: Wallet) {
  let { order, secret } = await createOrder();
  const signature = await signer.signOrder(config.src.chainId, order);
  console.log("order created and signed");
  return { order, signature, secret };
}

export async function deployEscrows(
  order: CrossChainOrder,
  signature: string,
  deployer: Wallet,
  resolverAccount: Account
) {
  // Resolver fills order
  const srcChainId = config.src.chainId;
  const orderHash = order.getOrderHash(srcChainId);
  const resolverContract = new Resolver(config.src.resolverContract);

  console.log(`[${srcChainId}]`, `Filling order ${orderHash}`);

  const fillAmount = order.makingAmount;
  const { txHash: orderFillHash, blockHash: srcDeployBlock } =
    await deployer.send(
      resolverContract.deploySrc(
        srcChainId,
        order,
        signature,
        TakerTraits.default()
          .setExtension(order.extension)
          .setAmountMode(AmountMode.maker)
          .setAmountThreshold(order.takingAmount),
        fillAmount
      )
    );

  console.log(
    `[${srcChainId}]`,
    `Order ${orderHash} filled for ${fillAmount} in tx ${orderFillHash}`
  );

  const escrowFactory = new EscrowFactory(provider, config.src.escrowFactory);
  const srcEscrowEvent = await escrowFactory.getSrcDeployEvent(srcDeployBlock);

  const dstImmutables = srcEscrowEvent[0];

  const hashlock = dstImmutables.hashLock.toString();
  const hashlockBuffer = Buffer.from(hashlock.replace("0x", ""), "hex");
  const depositAmount = dstImmutables.amount;
  const totalDeposit = depositAmount + BigInt(parseNearAmount("1.5")!);

  let { contractId: dstEscrow } = await deployNearEscrow(
    resolverAccount,
    config.dst.user.wallet_id,
    hashlockBuffer,
    totalDeposit
  );

  let srcFactory = new EscrowFactory(provider, config.src.escrowFactory);
  const ESCROW_SRC_IMPLEMENTATION = await srcFactory.getSourceImpl();
  const srcEscrow = new OneEscrowFactory(new Address(config.src.escrowFactory))
    .getSrcEscrowAddress(srcEscrowEvent[0], ESCROW_SRC_IMPLEMENTATION)
    .toString();

  console.log(`srcEscrow: ${srcEscrow}, dstEscrow: ${dstEscrow} `);
  return { dstImmutables, srcEscrow, dstEscrow };
}

export async function withdrawFunds(
  secret: string,
  srcEscrow: string,
  dstEscrow: string,
  resolverAccount: Account,
  resolverWallet: Wallet,
  immutables: Immutables
) {
  const { functionCall } = actionCreators;

  // FUNDS -> USER
  console.log(
    `[${config.dst.chainId}]`,
    `Withdrawing funds for user from ${dstEscrow}`
  );

  const actions = [
    functionCall(
      "withdraw", // method name
      { secret: secret }, // arguments object, key must match Rust
      30000000000000n, // gas (30 TGas)
      0n // deposit (0)
    ),
  ];

  let result = await resolverAccount.signAndSendTransaction({
    receiverId: dstEscrow, // Send the transaction TO the escrow contract
    actions,
  });

  // FUNDS -> RESOLVER
  console.log(
    `[${config.src.chainId}]`,
    `Withdrawing funds for resolver from ${srcEscrow}`
  );

  let resolverContract = new Resolver(config.src.resolverContract);
  const { txHash: resolverWithdrawHash } = await resolverWallet.send(
    resolverContract.withdraw("src", new Address(srcEscrow), secret, immutables)
  );

  console.log(
    `[${config.src.chainId}]`,
    `Withdrew funds for resolver from ${srcEscrow} to ${config.src.resolver.wallet_address} in tx ${resolverWithdrawHash}`
  );
}

export async function createOrder() {
  const secret = uint8ArrayToHex(randomBytes(32));

  const srcTimestamp = BigInt((await provider.getBlock("latest"))!.timestamp);
  const order = CrossChainOrder.new(
    new Address(config.src.escrowFactory),
    {
      salt: randBigInt(1000n),
      maker: new Address(config.src.user.wallet_address),
      makingAmount: parseEther("2"),  // 2 MOCK
      takingAmount: BigInt(parseNearAmount("7")!), // 7 NEAR
      makerAsset: new Address(config.src.tokens.MOCK),
      takerAsset: new Address(config.dst.tokens.NEAR), // DUMMY
    },
    {
      hashLock: HashLock.forSingleFill(secret),
      timeLocks: TimeLocks.new({
        srcWithdrawal: 0n, // 0sec finality lock for test
        srcPublicWithdrawal: 120n, // 2m for private withdrawal
        srcCancellation: 121n, // 1sec public withdrawal
        srcPublicCancellation: 122n, // 1sec private cancellation
        dstWithdrawal: 10n, // 10sec finality lock for test
        dstPublicWithdrawal: 100n, // 100sec private withdrawal
        dstCancellation: 101n, // 1sec public withdrawal
      }),
      srcChainId: config.src.chainId,
      dstChainId: config.dst.chainId,
      srcSafetyDeposit: parseEther("0.001"),
      dstSafetyDeposit: parseEther("0.001"),
    },
    {
      auction: new AuctionDetails({
        initialRateBump: 0,
        points: [],
        duration: 120n,
        startTime: srcTimestamp,
      }),
      whitelist: [
        {
          address: new Address(config.src.resolverContract),
          allowFrom: 0n,
        },
      ],
      resolvingStartTime: 0n,
    },
    {
      nonce: randBigInt(UINT_40_MAX),
      allowPartialFills: false,
      allowMultipleFills: false,
    }
  );
  return { order, secret };
}















export async function creatOrderN() {
  const secret = uint8ArrayToHex(randomBytes(32));
  const hashlock = keccak256(secret);
  const latestBlock = await nearProvider.block({ finality: "final" });
  const srcTimestamp =
    BigInt(latestBlock.header.timestamp_nanosec) / 1_000_000_000n;

  const order: CrossChainOrderN = {
    maker: config.dst.user.wallet_id,
    makingAmount: parseNearAmount("7")!,
    takerAsset: fromEnv.MOCK_ADDRESS,
    takingAmount: parseEther("2").toString(),
    // Use the 1inch SDK's HashLock class for consistency
    hashLock: HashLock.forSingleFill(secret).toString(),
    salt: randBigInt(1000n).toString(),
    srcChainId: config.dst.chainId,
    dstChainId: config.src.chainId,
    timeLocks: {
           srcWithdrawal: 0n.toString(), // 0sec finality lock for test
        srcPublicWithdrawal: 120n.toString(), // 2m for private withdrawal
        srcCancellation: 121n.toString(), // 1sec public withdrawal
        srcPublicCancellation: 122n.toString(), // 1sec private cancellation
        dstWithdrawal: 10n.toString(), // 10sec finality lock for test
        dstPublicWithdrawal: 100n.toString(), // 100sec private withdrawal
        dstCancellation: 101n.toString(), // 1sec public withdrawal
    },
    auction: {
      startTime: srcTimestamp.toString(),
      duration: "120", // 2 minutes in seconds
    },
  };
  const orderHash = keccak256(Buffer.from(JSON.stringify(order)));
  console.log(`   - Order Hash: ${orderHash}`);

  return { order, secret, orderHash, hashlock };
}

export async function createSignedOrderN(userNearKeyPair: KeyPair) {
  let { order, orderHash, secret, hashlock } = await creatOrderN();

  const { signature } = userNearKeyPair.sign(
    Buffer.from(orderHash.replace("0x", ""), "hex")
  );

  console.log(`✅ Order created and signed.`);

  return {
    order,
    hashlock,
    orderHash,
    secret,
    signature: Buffer.from(signature).toString("base64"),
  };
}

// export async function deployEscrowsN(
//   order: CrossChainOrderN,
//   orderHash: string,
//   hashLock: string,
//   deployer: Wallet,
//   signature: string,
//   resolverAccount: Account
// ) {
//   const immutables = Immutables.new({
//     orderHash: orderHash,
//     hashLock: HashLock.fromString(hashLock),
//     maker: new Address(config.src.resolver.wallet_address), // On EVM, the resolver is the "maker" of this escrow
//     taker: new Address(config.src.user.wallet_address), // The user's EVM address
//     token: new Address(order.takerAsset),
//     amount: BigInt(order.takingAmount),
//     safetyDeposit: parseEther("0.001"), // This should probably come from the order object
//     timeLocks: TimeLocks.new({
//       srcWithdrawal: BigInt(order.timeLocks.srcWithdrawal),
//       srcPublicWithdrawal: BigInt(order.timeLocks.srcPublicWithdrawal),
//       srcCancellation: BigInt(order.timeLocks.srcCancellation),
//       srcPublicCancellation: BigInt(order.timeLocks.srcPublicCancellation),
//       dstWithdrawal: BigInt(order.timeLocks.dstWithdrawal),
//       dstPublicWithdrawal: BigInt(order.timeLocks.dstPublicWithdrawal),
//       dstCancellation: BigInt(order.timeLocks.dstCancellation),
//     }),
//   });

//   const resolverContract = new Resolver(configN.dst.resolverContract);
//   const txRequest = resolverContract.deploySrc(
//     1,
//     CrossChainOrder.new(order),
//     signature
//     immutables,
//     config.src.escrowFactory // Pass the factory address here
//   );
//   const receipt = await deployer.send(txRequest);

//   const escrowFactoryHelper = new EscrowFactory(
//     provider,
//     config.src.escrowFactory
//   );
//   const srcEscrowEvent = await escrowFactoryHelper.getDstDeployEvent(
//     receipt.blockHash
//   );


//   let srcFactory = new EscrowFactory(provider, config.src.escrowFactory);
//   const ESCROW_DST_IMPLEMENTATION = await srcFactory.getDestinationImpl();


//   const dstEscrowAddress = new OneEscrowFactory(new Address(config.src.escrowFactory))
//     .getSrcEscrowAddress(srcEscrowEvent[0], ESCROW_DST_IMPLEMENTATION, )
//     .toString();

//   const hashlockBuffer = Buffer.from(hashLock.replace("0x", ""), "hex");
//   const depositAmount = immutables.amount;
//   const totalDeposit = depositAmount + BigInt(parseNearAmount("1.5")!);

//   let { contractId: srcEscrowAddress } = await deployNearEscrow(
//     resolverAccount,
//     config.dst.user.wallet_id,
//     hashlockBuffer,
//     totalDeposit
//   );
//   console.log(
//     `Deployed escrows: src ${srcEscrowAddress} and dst ${dstEscrowAddress}`
//   );

//   return { srcEscrowAddress, dstEscrowAddress, immutables };
// }

export async function withdrawFundsN(
  secret: string,
  dstEscrowAddress: string, // Returned from deployEscrowsN
  immutables: Immutables, // Returned from deployEscrowsN
  srcEscrowAddress: string, // The address of the initial escrow on NEAR
  resolverWallet: Wallet, // The resolver's EVM wallet
  resolverAccount: Account // The resolver's NEAR account
) {
  // 1. Withdraw on EVM (Funds go to the user)
  console.log(`[EVM]`, `Withdrawing funds for user from ${dstEscrowAddress}`);
  const resolverContract = new Resolver(config.src.resolverContract);
  await resolverWallet.send(
    resolverContract.withdraw(
      "src",
      new Address(dstEscrowAddress),
      secret,
      immutables
    )
  );
  console.log(`✅ EVM withdrawal successful.`);

  // 2. Withdraw on NEAR (Funds go to the resolver)
  console.log(
    `[NEAR]`,
    `Withdrawing funds for resolver from ${srcEscrowAddress}`
  );
  const { functionCall } = actionCreators;
  await resolverAccount.signAndSendTransaction({
    receiverId: srcEscrowAddress,
    actions: [
      functionCall("withdraw", { secret: secret }, 30000000000000n, 0n),
    ],
  });
  console.log(`✅ NEAR withdrawal successful.`);
}

interface TimeLocksN {
  srcWithdrawal: string;
  srcPublicWithdrawal: string;
  srcCancellation: string;
  srcPublicCancellation: string;
  dstWithdrawal: string;
  dstPublicWithdrawal: string;
  dstCancellation: string;
}

interface AuctionDetailsN {
  startTime: string; // UNIX timestamp in seconds
  duration: string;
}

interface CrossChainOrderN {
  maker: string;
  makingAmount: string; // in yoctoNEAR
  takerAsset: string;
  takingAmount: string; // in wei
  hashLock: string;
  timeLocks: TimeLocksN;
  auction: AuctionDetailsN;
  salt: string;
  srcChainId: number;
  dstChainId: number;
}

async function getLatestTimestamp() {
  try {
    const latestBlock = await nearProvider.block({ finality: "final" });
    if (!latestBlock) {
      throw new Error("Could not fetch the latest block.");
    }

    const timestampNanosec = latestBlock.header.timestamp_nanosec;

    return timestampNanosec;
  } catch (error) {
    console.error("Failed to get latest NEAR block timestamp:", error);
  }
}

export function findErrror(code: string) {
  let errors = [
    "AdvanceEpochFailed()",
    "ArbitraryStaticCallFailed()",
    "BadSignature()",
    "BitInvalidatedOrder()",
    "ETHTransferFailed()",
    "EnforcedPause()",
    "EpochManagerAndBitInvalidatorsAreIncompatible()",
    "EthDepositRejected()",
    "ExpectedPause()",
    "InvalidMsgValue()",
    "InvalidPermit2Transfer()",
    "InvalidShortString()",
    "InvalidatedOrder()",
    "MakingAmountTooLow()",
    "MismatchArraysLengths()",
    "OrderExpired()",
    "OrderIsNotSuitableForMassInvalidation()",
    "OwnableInvalidOwner(address)",
    "OwnableUnauthorizedAccount(address)",
    "PartialFillNotAllowed()",
    "Permit2TransferAmountTooHigh()",
    "PredicateIsNotTrue()",
    "PrivateOrder()",
    "ReentrancyDetected()",
    "RemainingInvalidatedOrder()",
    "SafeTransferFailed()",
    "SafeTransferFromFailed()",
    "SimulationResults(bool,bytes)",
    "StringTooLong(string)",
    "SwapWithZeroAmount()",
    "TakingAmountExceeded()",
    "TakingAmountTooHigh()",
    "TransferFromMakerToTakerFailed()",
    "TransferFromTakerToMakerFailed()",
    "WrongSeriesNonce()",
  ];
  const errorSelectors: Record<string, string> = {};
  for (const error of errors) {
    const fullHash = ethers.keccak256(ethers.toUtf8Bytes(error));
    const selector = fullHash.slice(0, 10);
    errorSelectors[selector] = error;
  }

  console.log(errorSelectors[code]);
}
