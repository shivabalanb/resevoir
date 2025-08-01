import { Account } from "@near-js/accounts";
import { KeyPairSigner, Signer } from "@near-js/signers";
import { JsonRpcProvider, Provider } from "@near-js/providers";
import { FinalExecutionOutcome, TxExecutionStatus } from "@near-js/types";
import { KeyPair, KeyPairString } from "@near-js/crypto";
import { formatNearAmount } from "@near-js/utils";

// --- Configuration ---

const NEAR_CONTRACT_ID = process.env.NEAR_CONTRACT_ID!;
const NEAR_RESOLVER_ACCOUNT_ID = process.env.NEAR_RESOLVER_ACCOUNT_ID!;
const NEAR_RESOLVER_PRIVATE_KEY = process.env.NEAR_RESOLVER_PRIVATE_KEY!;
const NEAR_NODE_URL = process.env.NEAR_NODE_URL!;
const NETWORK_ID = 'localnet';

async function setupNear(): Promise<{
  provider: Provider;
  resolverAccount: Account;
}> {
  const keyPair = KeyPair.fromString(NEAR_RESOLVER_PRIVATE_KEY as KeyPairString);
  const signer: Signer = new KeyPairSigner(keyPair);
  const provider: Provider = new JsonRpcProvider({
    url: NEAR_NODE_URL,
  }) as Provider;
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
  const block = await provider.viewBlock({ finality: "final" });
  const chunks = await Promise.all(
    block.chunks.map((chunk) => provider.viewChunk(chunk.chunk_hash))
  );

  for (const chunk of chunks) {
    for (const tx of chunk.transactions) {
      if (tx.receiver_id === NEAR_CONTRACT_ID) {
        const outcome = await provider.viewTransactionStatus(
          tx.hash,
          tx.signer_id,
          "final" as TxExecutionStatus
        );

        for (const receipt of outcome.receipts_outcome) {
          for (const log of receipt.outcome.logs) {
            if (log.includes("ClaimEvent")) {
              try {
                const eventData = JSON.parse(log);
                if (eventData.secret_hex) {
                  console.log(`Found secret on NEAR: ${eventData.secret_hex}`);
                  return eventData.secret_hex;
                }
              } catch (e) {
              }
            }
          }
        }
      }
    }
  }
  return null;
}
