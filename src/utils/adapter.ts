import { fallback, parseJsonWithGemini } from "./gemini";
import { agentView } from "@neardefi/shade-agent-js";
import { CONTRACT_ID } from "./near";

// Cached oracle config - fetched once from contract
let cachedConfig: { description: string; api_url: string } | null = null;

async function getOracleConfig(): Promise<{
  description: string;
  api_url: string;
}> {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const config = await agentView({
      contractId: CONTRACT_ID,
      methodName: "get_config",
    });

    cachedConfig = config;
    return config;
  } catch (error) {
    console.warn("Failed to fetch oracle config from contract, using default");
    return {
      description: "This is an oracle powered by shade agents on NEAR",
      api_url: "https://api.coinbase.com/v2/prices/ETH-USD/spot",
    };
  }
}

export async function fetchData() {
  try {
    // Get config from contract (includes both description and api_url)
    const config = await getOracleConfig();
    console.log("Fetching from:", config.api_url);

    const r = await fetch(config.api_url);
    const j = await r.json();

    // Use Gemini for intelligent parsing
    console.log("Oracle description:", config.description);
    const parsed = await parseJsonWithGemini(j, config.description);

    // Ensure proper types for NEAR contract
    return {
      value: Number(parsed.value) as number,
      decimals: Number(parsed.decimals) as number,
      reasoning: parsed.reasoning,
      timestamp: Math.floor(parsed.timestamp) as number,
      source: parsed.source,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return fallback;
  }
}

// let test = {
//   value: 422627,
//   decimals: 2,
//   description: "ETH/USD price from SUS",
//   timestamp: 1703123456789,
//   source: "Coinbase",
// };
// return test;

// export async function fetchData() {
//   const r = await fetch(
//     "https://www.okx.com/api/v5/market/ticker?instId=ETH-USDT"
//   );
//   const j = await r.json();
//   const usd = j.data[0].last as number;
//   return {
//     value: Math.round(usd * 100),
//     decimals: 2,
//     description: "ETH/USDT price from OKX",
//     timestamp: Date.now(),
//     source: "okx",
//   };
// }
