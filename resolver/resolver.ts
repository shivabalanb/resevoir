import * as dotenv from "dotenv";
dotenv.config();

import { approveTokens, createAndSignOrder, fillEthOrder } from "./ethereum";

/**
 * The main function to orchestrate the entire swap.
 */
async function main() {
  console.log("--- Starting ETH->NEAR Swap Simulation ---");

  // await approveTokens();
  const { order, signature } = await createAndSignOrder();
  const fillTxReceipt = await fillEthOrder(order, signature);

  if (fillTxReceipt) {
    console.log("[RESOLVER]: Order filled successfully!");
    console.log("[RESOLVER]: Transaction hash:", fillTxReceipt.hash);
  } else {
    console.log("[RESOLVER]: Failed to fill order on Ethereum. Aborting.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
