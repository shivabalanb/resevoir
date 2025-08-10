import { parseJsonWithGemini } from "./gemini";

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

export async function fetchData() {
  // let test = {
  //   value: 422627,
  //   decimals: 2,
  //   description: "ETH/USD price from SUS",
  //   timestamp: 1703123456789,
  //   source: "Coinbase",
  // };
  // return test;
  try {
    // Fetch from Coinbase API
    const r = await fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot");
    const j = await r.json();

    // Use Gemini to parse the JSON response
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (geminiApiKey && geminiApiKey.length > 0) {
      // Use Gemini for intelligent parsing
      const parsed = await parseJsonWithGemini(
        j,
        "ETH/USD price from Coinbase"
      );

      // Ensure proper types for NEAR contract
      return {
        value: Number(parsed.value) as number, // Gemini already provides the correct integer value
        decimals: Number(parsed.decimals) as number, // Ensure it's a number
        description: parsed.description,
        timestamp: Math.floor(parsed.timestamp) as number, // Ensure integer timestamp
        source: parsed.source,
      };
    } else {
      // Fallback to manual parsing
      const usd = j.data.amount as number;
      return {
        value: Math.round(usd * 100), // Convert to integer and then to string
        decimals: 2, // Small integer
        description: "ETH/USD price from Coinbase",
        timestamp: Math.floor(Date.now()), // Ensure integer timestamp
        source: "coinbase",
      };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // Return fallback data
    return {
      value: "0", // Simple string for error case
      decimals: 2, // Small integer
      description: "Error fetching data",
      timestamp: Math.floor(Date.now()).toString(), // Ensure integer timestamp
      source: "error",
    };
  }
}

// Function to fetch from any API with Gemini parsing
export async function fetchDataFromApi(
  apiUrl: string,
  description: string,
  apiKey?: string
) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const response = await fetch(apiUrl, { headers });
    const jsonData = await response.json();

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (geminiApiKey && geminiApiKey.length > 0) {
      const parsed = await parseJsonWithGemini(jsonData, description);

      // Ensure proper types for NEAR contract
      return {
        value: parsed.value.toString(), // Gemini already provides the correct integer value
        decimals: Number(parsed.decimals) as number, // Ensure it's a number
        description: parsed.description,
        timestamp: Math.floor(parsed.timestamp).toString(), // Ensure integer timestamp
        source: parsed.source,
      };
    } else {
      throw new Error("Gemini API key not configured");
    }
  } catch (error) {
    console.error(`Error fetching from ${apiUrl}:`, error);
    return {
      value: "0", // Simple string for error case
      decimals: 2, // Small integer
      description: `Error fetching from ${apiUrl}`,
      timestamp: Math.floor(Date.now()).toString(), // Ensure integer timestamp
      source: "error",
    };
  }
}
