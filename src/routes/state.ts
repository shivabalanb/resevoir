// src/routes/state.ts
import { Hono } from "hono";
import { agentView } from "@neardefi/shade-agent-js";

const app = new Hono();

app.get("/", async (c) => {
  try {
    const contractId = process.env.NEAR_ACCOUNT_ID!;
    const rec = await agentView({
      contractId,
      methodName: "get_record", // ✅ Use methodName, not method
      args: {}, // ✅ Empty args object
    });
    return c.json(rec ?? null);
  } catch (e: any) {
    return c.json({ error: e.message || "view failed" }, 500);
  }
});

export default app;
