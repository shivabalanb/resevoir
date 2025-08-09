import { Hono } from "hono";
import { agentCall } from "@neardefi/shade-agent-js";
import { fetchData } from "../utils/adapter";
import { CONTRACT_ID, GAS } from "../utils/near";

const app = new Hono();
app.post("/", async (c) => {
  try {
    const d = await fetchData(); // {value, decimals, timestamp, source}
    const res = await agentCall({
      contractId: CONTRACT_ID,
      methodName: "set_record",
      args: { rec: d },
      gas: GAS,
      deposit: "0",
    });

    // Handle the response properly - check the structure
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
