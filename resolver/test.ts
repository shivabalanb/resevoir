import {
  ethers,
  JsonRpcProvider,
  ContractFactory,
  Wallet as SignerWallet,
  Contract,
  parseEther,
} from "ethers";
import { fromEnv, config, ChainConfig } from "./config";
import { Wallet } from "./wallet";
import { EscrowFactory } from "./escrow-factory";
import ITestEscrowFactory from "./abi/TestEscrowFactory.json";
import IResolver from "./abi/Resolver.json";
import IMOCK from "./abi/MOCK.json";
import { Address } from "@1inch/cross-chain-sdk";
import { Resolver } from "./resolver1";
import { ERC20__factory } from "./types";
import { MOCK, MOCK__factory } from "./typechain-types";

let srcProvider: JsonRpcProvider;
let userWallet: Wallet;
let resolverWallet: Wallet;

let escrowFactoryContract: EscrowFactory;
let resolverContract: Resolver;

let mockContract: MOCK;

async function testflow() {
  await setup();
}

async function fundAndApprove() {
  console.log("--- Funding and approving assets...");

  // user
  // const userWalletAddress = await userWallet.getAddress();
  // console.log(userWalletAddress)
  // const fundAmount = parseEther("1000");
  // await mockContract.mint(userWalletAddress, fundAmount);
  const approveAmount = (1n << 256n) - 1n;
  await userWallet.approveToken(
    fromEnv.MOCK_ADDRESS,
    fromEnv.LOP_ADDRESS,
    approveAmount
  );
  console.log("   - User funded and approved LOP.");

  // resolver wallet : needs to have 1 ETH to transfer to resolver contract
  // resolver wallet : mint MOCK???
  // const resolverWalletAddress = await userWallet.getAddress();
  // await mockContract.mint(resolverWalletAddress, fundAmount);
  // const ethBalance = ethers.parseEther(
  //   ethers.formatEther(await srcProvider.getBalance(resolverWallet))
  // );
  // if (ethBalance < ethers.parseEther("1")) {
  //   throw new Error(`Insufficient balance: Account has less than 1 ETH.`);
  // }

  // resolver contract needs ETH funded
  // await resolverWallet.transfer(resolverContract.srcAddress, parseEther("1"));
  // console.log("   - Resolver funded and its contract is set up.");
}

async function setup() {
  console.log("--- Initializing wallets and connecting to contracts...");
  srcProvider = new JsonRpcProvider(fromEnv.CHAIN_RPC);
  userWallet = new Wallet(fromEnv.USER_WALLET_PRIVATE_KEY, srcProvider);
  resolverWallet = new Wallet(fromEnv.RESOLVER_WALLET_PRIVATE_KEY, srcProvider);

  escrowFactoryContract = new EscrowFactory(
    srcProvider,
    fromEnv.ESCROW_FACTORY_ADDRESS
  );
  resolverContract = new Resolver(fromEnv.RESOLVER_CONTRACT_ADDRESS);
  mockContract = MOCK__factory.connect(fromEnv.MOCK_ADDRESS, userWallet.signer);
  const userWalletAddress = await userWallet.getAddress();

  console.log(`   - User Wallet: ${userWalletAddress}`);
  console.log(`   - Resolver Wallet: ${userWalletAddress}`);
  console.log(`   - Resolver Contract: ${resolverContract.srcAddress}`);

  await fundAndApprove();
}

function findErrror() {
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
    errorSelectors[error] = selector;
  }

  console.log(errorSelectors);
}

testflow();
