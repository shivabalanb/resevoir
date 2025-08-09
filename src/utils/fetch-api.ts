export type AgentResolution = {
  value: number;
  decimals: number;
  timestamp: number;
  source?: string;
};

const API_URL = "https://api.coinbase.com/v2/prices/ETH-USD/spot";

export async function getAgentResponse() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    const result = parseFloat(data.data.amount);
    console.log(`API response: $${result}`);
    return result;
  } catch (error) {
    console.error("Error fetching price from API:", error);
    return null;
  }
}
