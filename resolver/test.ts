import {
  ethers,
  JsonRpcProvider,
  ContractFactory,
  Wallet as SignerWallet,
  Contract,
  parseEther,
  randomBytes,
  parseUnits,
  NonceManager,
} from "ethers";
import { fromEnv, config, ChainConfig } from "./config";
import { Wallet } from "./wallet";
import { EscrowFactory } from "./escrow-factory";
import factoryContract from "./abi/TestEscrowFactory.json";
import resolverContract from "./abi/Resolver.json";
import IMOCK from "./abi/MOCK.json";
import { Address } from "@1inch/cross-chain-sdk";
import { Resolver } from "./resolver1";
import { ERC20__factory } from "./types";
import { MOCK, MOCK__factory } from "./typechain-types";
import * as Sdk from "@1inch/cross-chain-sdk";
import { uint8ArrayToHex, UINT_40_MAX } from "@1inch/byte-utils";
import * as path from "node:path";

import { InMemoryKeyStore } from "@near-js/keystores";
import { KeyPair, KeyPairString } from "@near-js/crypto";
import {
  JsonRpcProvider as NEARJsonRpcProvider,
  Provider,
} from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { Account } from "@near-js/accounts";
import { readFileSync } from "node:fs";
import { actionCreators } from "@near-js/transactions";
import { formatNearAmount, parseNearAmount } from "@near-js/utils";

// import { c, transfer, deployContract, functionCall } from '@near-js/transactions';

const CONTRACT_WASM_PATH = path.resolve(
  __dirname,
  "../contracts-near/target/near/resevoir.wasm"
);

let srcChainId = Sdk.SupportedChains[0];
let srcProvider = new JsonRpcProvider(fromEnv.SRC_CHAIN_RPC);
let userWallet = new Wallet(fromEnv.USER_WALLET_PRIVATE_KEY, srcProvider);
let resolverWallet = new Wallet(
  fromEnv.SRC_RESOLVER_WALLET_PRIVATE_KEY,
  srcProvider
);
let src: { escrowFactory: string; resolver: string };

let srcResolverContract: Wallet;

let mockContract: MOCK;

const keyPair = KeyPair.fromString(
  fromEnv.DST_RESOLVER_WALLET_PRIVATE_KEY as KeyPairString
);
const resolverAccountId = fromEnv.DST_RESOLVER_WALLET_ID;
const signer = new KeyPairSigner(keyPair);

const provider = new NEARJsonRpcProvider({
  url: fromEnv.DST_CHAIN_RPC,
});
const resolverAccount = new Account(
  resolverAccountId,
  provider as Provider,
  signer
);

async function deployNearEscrow(
  userId: string,
  hashlock: Buffer,
  deposit: bigint,
) {
  const newAccountId = `escrow-${Date.now()}.${resolverAccountId}`;
  const wasmBytes = readFileSync(CONTRACT_WASM_PATH);

  const initArgs = { user_id: userId, hashlock: hashlock.toString("base64"), amount: deposit.toString() };

  const { createAccount, transfer, deployContract, functionCall } =
    actionCreators;

  // 2. Define the storage cost and add it to the user's deposit
  const storageCost = BigInt(parseNearAmount('1.5')!); // 1.5 NEAR buffer for storage
  const depositPlusFees = deposit + storageCost;

  const actions = [
    createAccount(),
    transfer(depositPlusFees),
    deployContract(wasmBytes),
    functionCall(
      "new",
      initArgs,
      100000000000000n, // 100 TGas
      0n
    ),
  ];
  console.log(`[NEAR]`, `Deploying contract to ${newAccountId}...`);
  const result = await resolverAccount.signAndSendTransaction({
    receiverId: newAccountId,
    actions,
  });

  return { contractId: newAccountId, result };
}

async function testflow() {
  console.log(__dirname);
  // src = await deployContracts();
  src = {
    resolver: fromEnv.SRC_RESOLVER_CONTRACT_ADDRESS,
    escrowFactory: fromEnv.ESCROW_FACTORY_ADDRESS,
  };
  // await fundAndApprove();
  await createAndSignOrder();
}

async function setup() {
  console.log("--- Initializing wallets and connecting to contracts...");

  // escrowFactoryContract = new EscrowFactory(
  //   srcProvider,
  //   fromEnv.ESCROW_FACTORY_ADDRESS
  // );
  // mockContract = MOCK__factory.connect(fromEnv.MOCK_ADDRESS, userWallet.signer);
  // const userWalletAddress = await userWallet.getAddress();

  // await fundAndApprove();
}

async function fundAndApprove() {
  console.log("--- Funding and approving assets...");

  // --- 1. User Setup --- : mint(pre), approve LOP
  await userWallet.approveToken(
    fromEnv.MOCK_ADDRESS,
    fromEnv.LOP_ADDRESS,
    ethers.MaxUint256
  );
  console.log(`- User (${await userWallet.getAddress()}) approved LOP.`);

  // // --- 2. Resolver Setup (using NonceManager) ---

  // // Wrap the resolver's signer with NonceManager once at the beginning
  // let nonceManagedSigner = new NonceManager(resolverWallet.signer);

  // // Transaction 1: Fund the contract with ETH
  // let tx1 = await nonceManagedSigner.sendTransaction({
  //   to: resolverContract.srcAddress,
  //   value: parseEther("10"),
  // });
  // await tx1.wait();
  // console.log(`- Funded contract with ETH.`);

  // const fundAmount = parseEther("1000");
  // // Transaction 2: Mint MOCK tokens to the contract
  // let tx2 = await mockContract
  //   .connect(nonceManagedSigner)
  //   .mint(resolverContract.srcAddress, fundAmount);
  // await tx2.wait();
  // console.log(`- Minted MOCK tokens.`);

  // // Transaction 3: Have the contract approve the factory
  // const approveTxRequest = resolverContract.executeApprove(
  //   fromEnv.MOCK_ADDRESS,
  //   fromEnv.ESCROW_FACTORY_ADDRESS,
  //   ethers.MaxUint256
  // );
  // // The NonceManager will automatically add the correct nonce
  // let tx3 = await nonceManagedSigner.sendTransaction(approveTxRequest);
  // await tx3.wait();
  // console.log(`- Approved escrow factory.`);
}

async function createAndSignOrder() {
  console.log("--- reateAndSignOrder() ");

  const srcTimestamp = BigInt(
    (await srcProvider.getBlock("latest"))!.timestamp
  );
  const secret = uint8ArrayToHex(randomBytes(32)); // note: use crypto secure random number in real world

  const userWalletAddress = await userWallet.getAddress();

  const order = Sdk.CrossChainOrder.new(
    new Address(src.escrowFactory),
    {
      salt: Sdk.randBigInt(1000n),
      maker: new Address(userWalletAddress),
      makingAmount: parseEther("2"),
      takingAmount: BigInt(parseNearAmount("7")!),
      makerAsset: new Address(fromEnv.MOCK_ADDRESS),
      takerAsset: new Address(fromEnv.MOCK_ADDRESS),
    },
    {
      hashLock: Sdk.HashLock.forSingleFill(secret),
      timeLocks: Sdk.TimeLocks.new({
        srcWithdrawal: 0n, // 0sec finality lock for test
        srcPublicWithdrawal: 120n, // 2m for private withdrawal
        srcCancellation: 121n, // 1sec public withdrawal
        srcPublicCancellation: 122n, // 1sec private cancellation
        dstWithdrawal: 10n, // 10sec finality lock for test
        dstPublicWithdrawal: 100n, // 100sec private withdrawal
        dstCancellation: 101n, // 1sec public withdrawal
      }),
      srcChainId,
      dstChainId: Sdk.SupportedChains[1],
      srcSafetyDeposit: parseEther("0.001"),
      dstSafetyDeposit: parseEther("0.001"),
    },
    {
      auction: new Sdk.AuctionDetails({
        initialRateBump: 0,
        points: [],
        duration: 120n,
        startTime: srcTimestamp,
      }),
      whitelist: [
        {
          address: new Address(src.resolver),
          allowFrom: 0n,
        },
      ],
      resolvingStartTime: 0n,
    },
    {
      nonce: Sdk.randBigInt(UINT_40_MAX),
      allowPartialFills: false,
      allowMultipleFills: false,
    }
  );

  const signature = await userWallet.signOrder(srcChainId, order);
  const orderHash = order.getOrderHash(srcChainId);

  // Resolver fills order
  const resolverContract = new Resolver(src.resolver);

  console.log(`[${srcChainId}]`, `Filling order ${orderHash}`);

  const fillAmount = order.makingAmount;
  const { txHash: orderFillHash, blockHash: srcDeployBlock } =
    await resolverWallet.send(
      resolverContract.deploySrc(
        srcChainId,
        order,
        signature,
        Sdk.TakerTraits.default()
          .setExtension(order.extension)
          .setAmountMode(Sdk.AmountMode.maker)
          .setAmountThreshold(order.takingAmount),
        fillAmount
      )
    );

  console.log(
    `[${srcChainId}]`,
    `Order ${orderHash} filled for ${fillAmount} in tx ${orderFillHash}`
  );

  const escrowFactoryContract = new EscrowFactory(
    srcProvider,
    fromEnv.ESCROW_FACTORY_ADDRESS
  );
  const srcEscrowEvent = await escrowFactoryContract.getSrcDeployEvent(
    srcDeployBlock
  );

  console.log("HASHLOCK FIND: ", srcEscrowEvent);

  // const dstImmutables = srcEscrowEvent[0]
  //   .withComplement(srcEscrowEvent[1])

  const depositAmount = srcEscrowEvent[0].amount;
  const hashlock = srcEscrowEvent[0].hashLock.toString();
  const hashlockBuffer = Buffer.from(hashlock.replace("0x", ""), "hex");

  const storageCost = BigInt(parseNearAmount("1.5")!); // Add a buffer of 1.5 NEAR
  const totalDeposit = depositAmount + storageCost; // The total will now be 8.5 NEAR

  let { contractId: dstEscrowAddress, result } = await deployNearEscrow(
    fromEnv.DST_USER_WALLET_ID, // User's NEAR account
    hashlockBuffer,
    totalDeposit // Amount from the swap event
  );

  console.log(
    `[NEAR]`,
    `Deployed DstEscrow to ${dstEscrowAddress} in tx ${result.transaction.hash}`
  );
  let srcFactory = new EscrowFactory(srcProvider, src.escrowFactory);
  const ESCROW_SRC_IMPLEMENTATION = await srcFactory.getSourceImpl();
  const srcEscrowAddress = new Sdk.EscrowFactory(
    new Address(src.escrowFactory)
  ).getSrcEscrowAddress(srcEscrowEvent[0], ESCROW_SRC_IMPLEMENTATION);

  // console.log(`srcEscrow: ${srcEscrowAddress}`);

  console.log(
    `srcEscrow: ${srcEscrowAddress}, dstEscrow: ${dstEscrowAddress} `
  );

  const { functionCall } = actionCreators;

  // FUNDS -> USER
  console.log(
    `[${fromEnv.DST_CHAIN_ID}]`,
    `Withdrawing funds for user from ${dstEscrowAddress}`
  );

  const actions = [
    functionCall(
      "withdraw", // method name
      { secret: secret }, // arguments object, key must match Rust
      30000000000000n, // gas (30 TGas)
      0n // deposit (0)
    ),
  ];

  result = await resolverAccount.signAndSendTransaction({
    receiverId: dstEscrowAddress, // Send the transaction TO the escrow contract
    actions,
  });

  // FUNDS -> RESOLVER
  console.log(
    `[${srcChainId}]`,
    `Withdrawing funds for resolver from ${srcEscrowAddress}`
  );
  console.log("immutables: ", srcEscrowEvent[0]);
  const { txHash: resolverWithdrawHash } = await resolverWallet.send(
    resolverContract.withdraw(
      "src",
      srcEscrowAddress,
      secret,
      srcEscrowEvent[0]
    )
  );

  console.log(
    `[${srcChainId}]`,
    `Withdrew funds for resolver from ${srcEscrowAddress} to ${src.resolver} in tx ${resolverWithdrawHash}`
  );
}

function findErrror(code: string) {
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

async function deployContracts(): Promise<{
  escrowFactory: string;
  resolver: string;
}> {
  const provider = srcProvider;
  const deployer = new SignerWallet(fromEnv.USER_WALLET_PRIVATE_KEY, provider);

  const escrowFactory = await deploy(
    factoryContract,
    [
      fromEnv.LOP_ADDRESS,
      fromEnv.WRAPPED_NATIVE, // feeToken,
      Address.fromBigInt(0n).toString(), // accessToken,
      deployer.address, // owner
      60 * 30, // src rescue delay
      60 * 30, // dst rescue delay
    ],
    provider,
    deployer
  );
  console.log(
    `[${srcChainId}]`,
    `Escrow factory contract deployed to`,
    escrowFactory
  );

  const resolver = await deploy(
    resolverContract,
    [
      escrowFactory,
      fromEnv.LOP_ADDRESS,
      resolverWallet, // resolver as owner of contract
    ],
    provider,
    deployer
  );

  console.log(`[${srcChainId}]`, `Resolver contract deployed to`, resolver);
  return { resolver, escrowFactory };
}

async function deploy(
  json: { abi: any; bytecode: any },
  params: unknown[],
  provider: JsonRpcProvider,
  deployer: SignerWallet
): Promise<string> {
  const deployed = await new ContractFactory(
    json.abi,
    json.bytecode,
    deployer
  ).deploy(...params);
  await deployed.waitForDeployment();

  return await deployed.getAddress();
}

testflow();
// findErrror("0xc56873ba");
