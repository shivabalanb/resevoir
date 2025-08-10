import { Hono } from "hono";
import { agentView } from "@neardefi/shade-agent-js";
import { CONTRACT_ID } from "../utils/near";

const app = new Hono();

app.get("/", async (c) => {
  try {
    const config = await agentView({
      contractId: CONTRACT_ID,
      methodName: "get_config",
    });

    return c.json({
      apiUrl: config.api_url,
      description: config.description,
      success: true,
    });
  } catch (error: any) {
    console.error("Error fetching config:", error);
    return c.json(
      {
        error: error.message || "Failed to fetch config",
        success: false,
      },
      500
    );
  }
});

export default app;
