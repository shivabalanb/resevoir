// src/routes/state.ts
import { Hono } from "hono";
import { agentView } from "@neardefi/shade-agent-js";
import { CONTRACT_ID } from "../utils/near";

const app = new Hono();

app.get("/", async (c) => {
  try {
    const rec = await agentView({
      contractId: CONTRACT_ID,
      methodName: "get_oracle_data",
    });
    return c.json(rec ?? null);
  } catch (e: any) {
    return c.json({ error: e.message || "view failed" }, 500);
  }
});

export default app;
