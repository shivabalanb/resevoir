// =================================================================
// resolver/client.ts
// =================================================================
// This script mimics a user's frontend. It creates a secret,
// builds a 1inch limit order for a cross-chain swap, and signs it.
// The output of this script is the input for your resolver.

import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

// Load variables from .env
const ETH_RPC_URL = process.env.ETH_RPC_URL!;
const ETH_USER_PRIVATE_KEY = process.env.ETH_USER_PRIVATE_KEY!;
const LOP_ADDRESS = process.env.LOP_ADDRESS!; 
const MOCK_TOKEN_ADDRESS = process.env.MOCK_TOKEN_ADDRESS!;

const provider = new ethers.JsonRpcProvider(ETH_RPC_URL);
const userWallet = new ethers.Wallet(ETH_USER_PRIVATE_KEY, provider);

// --- EIP-712 Domain for 1inch Limit Order Protocol ---
// This must match the domain used by the smart contract
const domain = {
  name: "1inch Limit Order Protocol",
  version: "4", // Check the version of the contract you deployed
  chainId: 31337, // 31337 is the default for local Anvil
  verifyingContract: LOP_ADDRESS,
};

// --- EIP-712 Types for a 1inch Order ---
const types = {
  Order: [
    { name: "salt", type: "uint256" },
    { name: "makerAsset", type: "address" },
    { name: "takerAsset", type: "address" },
    { name: "maker", type: "address" },
    { name: "receiver", type: "address" },
    { name: "allowedSender", type: "address" },
    { name: "makingAmount", type: "uint256" },
    { name: "takingAmount", type: "uint256" },
    { name: "offsets", type: "uint256" },
    { name: "interactions", type: "bytes" },
  ],
};

/**
 * Main function to create and sign the order.
 */
async function createSignedOrder() {
  console.log("--- Creating and Signing Cross-Chain Order ---");
  console.log(`User (Maker) Address: ${userWallet.address}`);

  // 1. Generate the secret and the two required hashes
  const secret = ethers.randomBytes(32); // A 32-byte random secret
  const secretHex = ethers.hexlify(secret);
  const keccakHash = ethers.keccak256(secret);
  const sha256Hash = ethers.sha256(secret);

  console.log(`\nGenerated Secret: ${secretHex}`);
  console.log(`Keccak256 Hash (for ETH): ${keccakHash}`);
  console.log(`SHA256 Hash (for NEAR): ${sha256Hash}`);

  // 2. Define the order details
  const order = {
    salt: "1", // A random salt for uniqueness
    makerAsset: MOCK_TOKEN_ADDRESS, // The token the user is giving (MOCK)
    takerAsset: "0x0000000000000000000000000000000000000001", // A special "virtual" token for cross-chain
    maker: userWallet.address,
    receiver: "0x0000000000000000000000000000000000000000", // Receiver is the EscrowSrc contract
    allowedSender: "0x0000000000000000000000000000000000000000", // Anyone can fill
    makingAmount: ethers.parseUnits("10", 18), // User is giving 10 MOCK (assuming 18 decimals)
    takingAmount: "1", // This is ignored for cross-chain swaps
    offsets: "0",
    // The `interactions` field is where we pack the hashlock
    interactions: keccakHash,
  };

  // 3. Sign the EIP-712 typed data
  const signature = await userWallet.signTypedData(domain, types, order);

  console.log("\n--- Order Created Successfully! ---");
  console.log("\nSigned Order Details (for resolver):");
  console.log(JSON.stringify({ order, signature }, replacer, 2));

  console.log("\n--- NEXT STEP ---");
  console.log(
    "Copy the SHA256 Hash and use it as the `near_hashlock` in your resolver script."
  );
}

function replacer(key: any, value: any) {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

createSignedOrder().catch(console.error);
