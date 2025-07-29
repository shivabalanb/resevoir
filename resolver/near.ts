import { Account } from "@near-js/accounts";
import { KeyPairSigner, Signer } from "@near-js/signers";
import { JsonRpcProvider, Provider } from "@near-js/providers";
import { FinalExecutionOutcome, TxExecutionStatus } from "@near-js/types";
import { KeyPair } from "@near-js/crypto";
import { formatNearAmount } from "@near-js/utils";

// --- Configuration ---
const NEAR_CONTRACT_ID = "your_contract.testnet";
const NEAR_RESOLVER_ACCOUNT_ID = "resolver.testnet";
// IMPORTANT: The private key must be in the format "ed25519:..."
const NEAR_RESOLVER_PRIVATE_KEY = "ed25519:YOUR_NEAR_PRIVATE_KEY_HERE";
const NEAR_NODE_URL = "https://rpc.testnet.near.org";
const NETWORK_ID = "testnet";

async function setupNear(): Promise<{
  provider: Provider;
  resolverAccount: Account;
}> {
  // 1. Create a KeyPair from the private key string.
  const keyPair = KeyPair.fromString(NEAR_RESOLVER_PRIVATE_KEY);

  // 2. Create a Signer. Explicitly typing it helps resolve conflicts.
  const signer: Signer = new KeyPairSigner(keyPair);

  // 3. Set up the Provider. Explicitly typing it helps resolve conflicts.
  const provider: Provider = new JsonRpcProvider({
    url: NEAR_NODE_URL,
  }) as Provider;

  // 5. Create an Account object using the connection and the account ID.
  const resolverAccount = new Account(
    NEAR_RESOLVER_ACCOUNT_ID,
    provider,
    signer
  );

  return { provider, resolverAccount };
}

export async function lockFundsOnNear(
  userId: string,
  hashlock_hex: string,
  amountInNear: string
) {
  const { resolverAccount } = await setupNear();

  console.log(`Locking ${amountInNear} NEAR for user ${userId}`);

  try {
    const result = await resolverAccount.callFunction({
      contractId: NEAR_CONTRACT_ID,
      methodName: "lock",
      args: {
        user_id: userId,
        hashlock_hex: hashlock_hex,
        expiration_duration_ns: "86400000000000", // 24 hours in nanoseconds
      },
      gas: "300000000000000", // 300 TGas
      deposit: formatNearAmount(amountInNear),
    });

    if (!result) {
      throw new Error("Lock transaction failed to produce a result.");
    }

    console.log("Lock transaction successful on NEAR:", result.toString);
  } catch (error) {
    console.error("Error locking funds on NEAR:", error);
  }
}

export async function listenForSecretOnNear(): Promise<string | null> {
  const { provider } = await setupNear();
  console.log("Watching for claim events on NEAR...");

  // Use viewBlock, the modern equivalent of `block`.
  const block = await provider.viewBlock({ finality: "final" });

  // Use viewChunk, the modern equivalent of `chunk`.
  const chunks = await Promise.all(
    block.chunks.map((chunk) => provider.viewChunk(chunk.chunk_hash))
  );

  for (const chunk of chunks) {
    for (const tx of chunk.transactions) {
      if (tx.receiver_id === NEAR_CONTRACT_ID) {
        // Use viewTransactionStatus, the modern equivalent of `txStatus`.
        // Add the required 'waitUntil' argument. 'final' is the safest.
        const outcome = await provider.viewTransactionStatus(
          tx.hash,
          tx.signer_id,
          "final" as TxExecutionStatus
        );

        // Correctly check if the transaction status is a success.
        // Look for our specific log event within the receipts.
        for (const receipt of outcome.receipts_outcome) {
          for (const log of receipt.outcome.logs) {
            if (log.includes("ClaimEvent")) {
              // A simple check
              try {
                const eventData = JSON.parse(log);
                if (eventData.secret_hex) {
                  console.log(`Found secret on NEAR: ${eventData.secret_hex}`);
                  return eventData.secret_hex;
                }
              } catch (e) {
                /* ignore parse errors */
              }
            }
          }
        }
      }
    }
  }
  return null;
}
