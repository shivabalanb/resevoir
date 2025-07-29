import { ethers } from "ethers";
import { abi as EscrowFactoryABI } from "./abi/EscrowFactory.json";

const ETH_RPC_URL = "YOUR_SEPOLIA_RPC_URL"; // e.g., from Infura or Alchemy
const ETH_RESOLVER_PRIVATE_KEY = "YOUR_ETH_PRIVATE_KEY";
const INCH_ESCROW_FACTORY_ADDRESS = "1INCH_ESCROW_FACTORY_ADDRESS_ON_SEPOLIA";

// setupEth()
const provider = new ethers.JsonRpcProvider(ETH_RPC_URL);
const resolverWallet = new ethers.Wallet(ETH_RESOLVER_PRIVATE_KEY, provider);

export async function claimFundsOnEth(
  escrowAddress: string,
  secret: string,
  immutables: any
) {
  console.log(
    `Attempting to claim funds on Ethereum from escrow: ${escrowAddress}`
  );

  const escrowContract = new ethers.Contract(
    escrowAddress,
    EscrowFactoryABI,
    resolverWallet
  );

  try {
    const tx = await escrowContract.withdraw(secret, immutables, {
      gasLimit: 300000, // Set a reasonable gas limit
    });
    console.log(`Withdrawal transaction sent on Ethereum: ${tx.hash}`);
    await tx.wait();
    console.log(`Withdrawal confirmed! Swap complete.`);
  } catch (error) {
    console.error("Error claiming funds on Ethereum:", error);
  }
}
