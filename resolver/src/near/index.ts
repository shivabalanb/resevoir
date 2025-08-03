import * as path from "node:path";
import { actionCreators } from "@near-js/transactions";
import { readFileSync } from "node:fs";
import { Account } from "@near-js/accounts";
import { parseNearAmount } from "@near-js/utils";

const CONTRACT_WASM_PATH = path.resolve(
  __dirname,
  "../contracts-near/target/near/resevoir.wasm"
);

export async function deployNearEscrow(
  resolverAccount: Account,
  userId: string,
  hashlock: Buffer,
  deposit: bigint
) {
  const newAccountId = `escrow-${Date.now()}.${resolverAccount.accountId}`;
  const wasmBytes = readFileSync(CONTRACT_WASM_PATH);

  const initArgs = {
    user_id: userId,
    hashlock: hashlock.toString("base64"),
    amount: deposit.toString(),
  };

  const { createAccount, transfer, deployContract, functionCall } =
    actionCreators;

  const storageCost = BigInt(parseNearAmount("1.5")!); 
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