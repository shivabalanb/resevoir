import {
  BytesLike,
  ContractTransactionReceipt,
  ethers,
  Interface,
  parseUnits,
  Signature,
  Signer,
  TransactionRequest,
} from "ethers";
import * as Sdk from "@1inch/cross-chain-sdk";
import * as dotenv from "dotenv";
dotenv.config();

import { abi as LimitOrderProtocolABI } from "./abi/LimitOrderProtocol.json";
import { abi as EscrowFactoryABI } from "./abi/EscrowFactory.json";
import { abi as IEscrowSrcABI } from "./abi/IEscrowSrc.json";
import { abi as ERC20ABI } from "./abi/ERC20.json";
import { IBaseEscrow } from "./types/IEscrowSrc";
import { IOrderMixin, LimitOrderProtocol } from "./types/LimitOrderProtocol";
import {
  EscrowFactory,
  EscrowFactory__factory,
  LimitOrderProtocol__factory,
} from "./types";

const ETH_RPC_URL = process.env.ETH_RPC_URL!;
const ETH_USER_PRIVATE_KEY = process.env.ETH_USER_PRIVATE_KEY!;
const ETH_RESOLVER_PRIVATE_KEY = process.env.ETH_RESOLVER_PRIVATE_KEY!;
const LOP_ADDRESS = process.env.LOP_ADDRESS!;
const ESCROW_FACTORY_ADDRESS = process.env.ESCROW_FACTORY_ADDRESS!;
const MOCK_TOKEN_ADDRESS = process.env.MOCK_TOKEN_ADDRESS!;

const provider = new ethers.JsonRpcProvider(ETH_RPC_URL);
const srcChainUser = new ethers.Wallet(ETH_USER_PRIVATE_KEY, provider);
const srcChainResolver = new ethers.Wallet(ETH_RESOLVER_PRIVATE_KEY, provider);

export async function approveTokens() {
  console.log("--- approveTokens ---");

  const provider = new ethers.JsonRpcProvider(ETH_RPC_URL);
  const userWallet = new ethers.Wallet(ETH_USER_PRIVATE_KEY, provider);
  console.log(`Approving for user: ${userWallet.address}`);

  const mockTokenContract = new ethers.Contract(
    MOCK_TOKEN_ADDRESS,
    ERC20ABI,
    userWallet
  );

  const amountToApprove = ethers.MaxUint256;

  try {
    console.log(`Approving LOP contract (${LOP_ADDRESS}) to spend MockUSDC...`);

    const tx = await mockTokenContract.approve(LOP_ADDRESS, amountToApprove);

    console.log(`Approval transaction sent: ${tx.hash}`);
    await tx.wait();

    console.log("\n--- ✅ Approval Successful! ---");
    console.log("The Limit Order Protocol can now spend this user's MockUSDC.");
    console.log("You can now run your main swap script.");
  } catch (error) {
    console.error("Error during approval:", error);
  }
}

export async function createAndSignOrder(): Promise<{
  order: Sdk.CrossChainOrder;
  signature: string;
  secret: string;
  sha256Hash: string;
}> {
  console.log("--- createAndSignOrder ---");

  const secret = ethers.randomBytes(32);
  const secretHex = ethers.hexlify(secret);
  const sha256Hash = ethers.sha256(secret);

  const srcTimestamp = BigInt((await provider.getBlock("latest"))!.timestamp);

  const order = Sdk.CrossChainOrder.new(
    new Sdk.Address(ESCROW_FACTORY_ADDRESS),
    {
      // orderInfo
      salt: Sdk.randBigInt(1000n),
      maker: new Sdk.Address(srcChainUser.address),
      makingAmount: parseUnits("1", 18),
      takingAmount: parseUnits("1", 18),
      makerAsset: new Sdk.Address(MOCK_TOKEN_ADDRESS),
      takerAsset: new Sdk.Address("0x0000000000000000000000000000000000000001"),
    },
    {
      // escrowParams
      hashLock: Sdk.HashLock.forSingleFill(secretHex),
      timeLocks: Sdk.TimeLocks.new({
        srcWithdrawal: 600n,
        srcPublicWithdrawal: 1200n,
        srcCancellation: 1201n,
        srcPublicCancellation: 1202n,
        dstWithdrawal: 600n,
        dstPublicWithdrawal: 1200n,
        dstCancellation: 1201n,
      }),
      srcChainId: Sdk.SupportedChains[0],
      dstChainId: Sdk.SupportedChains[11],
      srcSafetyDeposit: 0n,
      dstSafetyDeposit: 0n,
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
          address: Sdk.Address.ZERO_ADDRESS,
          allowFrom: 0n,
        },
      ],
      resolvingStartTime: 0n,
    }
  );

  const typedData = order.getTypedData(Sdk.NetworkEnum.ETHEREUM);

  console.log("TYPED DATA: ", typedData);

  const correctDomain = {
    name: "1inch Limit Order Protocol",
    version: "4",
    chainId: 31337,
    verifyingContract: LOP_ADDRESS,
  };

  const signature = await srcChainUser.signTypedData(
    correctDomain,
    { Order: typedData.types.Order },
    typedData.message
  );

  return {
    order,
    signature,
    secret: secretHex,
    sha256Hash,
  };
}

export async function fillEthOrder(
  order: Sdk.CrossChainOrder,
  signature: string
): Promise<ContractTransactionReceipt | null> {
  console.log("--- fillEthOrder ---");

  console.log(
    "[ETH-HELPER] Submitting signed order to the Limit Order Protocol..."
  );
  try {
    const takerTraits = Sdk.TakerTraits.default()
      .setExtension(order.extension)
      .setAmountMode(Sdk.AmountMode.maker)
      .setAmountThreshold(order.takingAmount);

    const { trait, args } = takerTraits.encode();
    const signatureParts = ethers.Signature.from(signature);

    const lopInterface = new Interface(LimitOrderProtocolABI);
    const calldata = lopInterface.encodeFunctionData("fillOrderArgs", [
      order.build(),
      signatureParts.r,
      signatureParts.yParityAndS,
      order.makingAmount,
      trait,
      args,
    ]);
    const txRequest: TransactionRequest = {
      to: LOP_ADDRESS,
      data: calldata,
      value: order.escrowExtension.srcSafetyDeposit,
    };
    console.log("[ETH-HELPER] Sending the fill transaction...");
    const txResponse = await srcChainResolver.sendTransaction(txRequest);
    return (await txResponse.wait()) as ContractTransactionReceipt;
  } catch (error) {
    console.error("[ETH-HELPER] Error filling ETH order:", error);
    return null;
  }
}
