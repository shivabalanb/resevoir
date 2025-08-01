import {
  BytesLike,
  ContractTransactionReceipt,
  ethers,
  Interface,
  parseEther,
  parseUnits,
  Signature,
  Signer,
  TransactionRequest,
  Wallet,
} from "ethers";
import * as Sdk from "@1inch/cross-chain-sdk";
import * as dotenv from "dotenv";
dotenv.config();

import { abi as LOPlABI } from "./abi/LimitOrderProtocol.json";
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
const chainId = 11155111;

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
    console.log(
      `Approving LOP contract (${LOP_ADDRESS}) to spend Mock TOKEN...`
    );

    const tx = await mockTokenContract.approve(LOP_ADDRESS, amountToApprove);

    console.log(`Approval transaction sent: ${tx.hash}`);
    await tx.wait();

    console.log("\n--- ✅ Approval Successful! ---");
    console.log(
      "The Limit Order Protocol can now spend this user's Mock TOKEN."
    );
    console.log("You can now run your main swap script.");
  } catch (error) {
    console.error("Error during approval:", error);
  }
}

export async function createAndSignOrder() {
  // :
  // Promise<{
  //   order: Sdk.CrossChainOrder;
  //   signature: string;
  //   secret: string;
  //   sha256Hash: string;
  // }>
  console.log("--- createAndSignOrder ---");

  const secret = ethers.randomBytes(32);
  const secretHex = ethers.hexlify(secret);
  const sha256Hash = ethers.sha256(secret);
  const keccakHash = ethers.keccak256(secret);

  const srcTimestamp = BigInt((await provider.getBlock("latest"))!.timestamp);

  const domain: EIP712Object = {
    name: "1inch Limit Order Protocol",
    version: "4", // From LimitOrderProtocol.sol constructor
    chainId: chainId,
    verifyingContract: LOP_ADDRESS, // Must be your deployed LOP address
  };

  const types: EIP712Types = {
    Order: [
      { name: "salt", type: "uint256" },
      { name: "maker", type: "address" },
      { name: "receiver", type: "address" },
      { name: "makerAsset", type: "address" },
      { name: "takerAsset", type: "address" },
      { name: "makingAmount", type: "uint256" },
      { name: "takingAmount", type: "uint256" },
      { name: "makerTraits", type: "uint256" },
    ],
  };

  const order: EIP712Object = Sdk.CrossChainOrder.new(
    new Sdk.Address(ESCROW_FACTORY_ADDRESS),
    {
      // orderInfo
      salt: Sdk.randBigInt(1000n),
      maker: new Sdk.Address(srcChainUser.address),
      makingAmount: parseUnits("1", 18),
      takingAmount: parseUnits("1", 18),
      makerAsset: new Sdk.Address(MOCK_TOKEN_ADDRESS),
      takerAsset: new Sdk.Address(MOCK_TOKEN_ADDRESS),
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
          address: new Sdk.Address(srcChainUser.address),
          allowFrom: 0n,
        },
        {
          address: new Sdk.Address(ESCROW_FACTORY_ADDRESS),
          allowFrom: 0n,
        },
      ],
      resolvingStartTime: 0n,
    }
  ).build();

  let signature = await srcChainUser.signTypedData(domain, types, order);

  console.log(signature);

  fillEthOrder(
    chainId,
    order,
    signature,
    Sdk.TakerTraits.default()
      .setExtension(order.extension)
      .setAmountMode(Sdk.AmountMode.maker)
      .setAmountThreshold(order.takingAmount),
    order.makingAmount
  );
}
// return {
//   order,
//   signature,
//   secret: secretHex,
//   sha256Hash,
// };

//   const domain = {
//     name: '1inch Limit Order Protocol',
//     version: '4',
//     chainId: chainId,
//     verifyingContract: LOP_ADDRESS,
// };

// const types = {
//     Order: [
//         { name: 'salt', type: 'uint256' },
//         { name: 'makerAsset', type: 'address' },
//         { name: 'takerAsset', type: 'address' },
//         { name: 'maker', type: 'address' },
//         { name: 'receiver', type: 'address' },
//         { name: 'allowedSender', type: 'address' },
//         { name: 'makingAmount', type: 'uint256' },
//         { name: 'takingAmount', type: 'uint256' },
//         { name: 'makerTraits', type: 'uint256' },
//         { name: 'extension', type: 'bytes' },
//     ],
// };

// const order = {
//     salt: Date.now(),
//     makerAsset: MOCK_TOKEN_ADDRESS,
//     takerAsset: '0x0000000000000000000000000000000000000001',
//     maker: srcChainUser.address,
//     receiver: ethers.ZeroAddress,
//     allowedSender: ethers.ZeroAddress,
//     makingAmount: parseUnits("10", 18),
//     takingAmount: parseUnits("10", 18),
//     makerTraits: 0n,
//     extension: keccakHash,
// };

// const typedData = order.getTypedData(chainId);
// console.log("LOG");
// console.log(
//   typedData.domain,
//   { Order: typedData.types[typedData.primaryType] },
//   typedData.message
// );

// let signature = await srcChainUser.signTypedData(domain, types, order);

// async function send(signer: Signer, param: TransactionRequest) {
//   const res = await signer.sendTransaction({
//     ...param,
//     gasLimit: 10_000_000,
//     from: signer.getAddress(),
//   });
//   const receipt = await res.wait(1);

//   if (receipt && receipt.status) {
//     return {
//       txHash: receipt.hash,
//       blockTimestamp: BigInt((await res.getBlock())!.timestamp),
//       blockHash: res.blockHash as string,
//     };
//   }

//   throw new Error((await receipt?.getResult()) || "unknown error");
// }

export async function fillEthOrder(
  order: any,
  signature: string,
  safetyDeposit: bigint
): Promise<ContractTransactionReceipt | null> {
  const lopContract = new ethers.Contract(
    LOP_ADDRESS,
    LimitOrderProtocolABI,
    srcChainResolver
  );
  try {
    console.log(
      "[ETH-HELPER] Submitting signed order to the Limit Order Protocol..."
    );

    // Manually build TakerTraits: 7th bit (1n << 7) enables `target` in args
    const takerTraits = 1n << 7n;

    // Manually build args: target address + extension data
    const args = ethers.AbiCoder.defaultAbiCoder().encode(
      ["address", "bytes"],
      [ESCROW_FACTORY_ADDRESS, order.extension]
    );

    const signatureParts = ethers.Signature.from(signature);

    const tx = await lopContract.fillOrderArgs(
      order,
      signatureParts.r,
      signatureParts.yParityAndS,
      order.makingAmount,
      takerTraits,
      args,
      { value: safetyDeposit } // Use the passed-in safety deposit
    );

    console.log(`[ETH-HELPER] Fill transaction sent: ${tx.hash}`);
    return await tx.wait();
  } catch (error) {
    console.error("[ETH-HELPER] Error filling ETH order:", error);
    return null;
  }
}

// export async function fillEthOrder(
//   order: any,
//   signature: string
// ): Promise<ContractTransactionReceipt | null> {
//   const lopContract = new ethers.Contract(
//     LOP_ADDRESS,
//     LimitOrderProtocolABI,
//     srcChainResolver
//   );
//   try {
//     console.log(
//       "[ETH-HELPER] Submitting signed order to the Limit Order Protocol..."
//     );

//     // Manually build TakerTraits: 7th bit (1n << 7) enables `target` in args
//     const takerTraits = 1n << 7n;

//     // Manually build args: target address + extension data
//     const args = ethers.AbiCoder.defaultAbiCoder().encode(
//       ["address", "bytes"],
//       [ESCROW_FACTORY_ADDRESS, order.extension]
//     );

//     const signatureParts = ethers.Signature.from(signature);

//     const tx = await lopContract.fillOrderArgs(
//       order,
//       signatureParts.r,
//       signatureParts.yParityAndS,
//       order.makingAmount,
//       takerTraits,
//       args
//     );

//     console.log(`[ETH-HELPER] Fill transaction sent: ${tx.hash}`);
//     return await tx.wait();
//   } catch (error) {
//     console.error("[ETH-HELPER] Error filling ETH order:", error);
//     return null;
//   }
// }

export interface EIP712TypedData {
  types: EIP712Types;
  domain: EIP712Object;
  message: EIP712Object;
  primaryType: string;
}
export interface EIP712Types {
  [key: string]: EIP712Parameter[];
}
export interface EIP712Parameter {
  name: string;
  type: string;
}
export declare type EIP712ObjectValue = string | bigint | number | EIP712Object;
export interface EIP712Object {
  [key: string]: EIP712ObjectValue;
}
export type EIP712DomainType = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
};
