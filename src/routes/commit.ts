import { Hono } from "hono";
import { agentCall } from "@neardefi/shade-agent-js";
import { fetchData } from "../utils/adapter";
import { CONTRACT_ID, GAS } from "../utils/near";

const app = new Hono();
app.post("/", async (c) => {
  try {
    const d = await fetchData(); // {value, decimals, timestamp, source}
    console.log("Data to commit:", d);

    console.log("Calling agent with:", {
      contractId: CONTRACT_ID,
      methodName: "update_oracle_data",
      args: { rec: d },
      gas: GAS,
      deposit: "0",
    });

    const res = await agentCall({
      contractId: CONTRACT_ID,
      methodName: "update_oracle_data",
      args: { rec: d }, // Keep the rec wrapper as the contract expects
      gas: GAS,
      deposit: "0",
    });

    // Handle the response properly - check the structure
    console.log("Agent call response type:", typeof res);
    console.log("Agent call response:", res);

    // The response structure might be different, so handle it safely
    const txHash = res?.transaction_outcome?.id || res?.id || "unknown";

    return c.json({
      txHash,
      committed: d,
      success: true,
    });
  } catch (error: any) {
    console.error("Commit error:", error);
    console.error("Error stack:", error.stack);
    return c.json(
      {
        error: error.message || "Commit failed",
        success: false,
      },
      500
    );
  }
});
export default app;
