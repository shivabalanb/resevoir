import { Hono } from "hono";
import { agentAccountId, agent } from "@neardefi/shade-agent-js";
const app = new Hono();
app.get("/", async (c) => {
  const id = await agentAccountId();
  // const id = { accountId: "ac-proxy.shadeagent000.testnet" };
  const bal = await agent("getBalance");
  return c.json({ accountId: id.accountId, balance: bal.balance });
});
export default app;
