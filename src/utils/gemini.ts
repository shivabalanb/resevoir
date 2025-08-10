import { GoogleGenAI } from "@google/genai";

export async function parseJsonWithGemini(
  jsonData: any,
  description: string
): Promise<{
  value: number;
  decimals: number;
  reasoning: string;
  timestamp: number;
  source: string;
}> {
  const prompt = `
Parse the following JSON data and extract the relevant information to fit this structure:
{
  "value": integer (the numeric value as a whole number, multiply by 10^decimals),
  "decimals": integer (decimal places, typically 2-8),
  "reasoning": string (explain your reasoning for how you chose the values),
  "timestamp": integer (Unix timestamp in milliseconds as whole number),
  "source": string (data source name)
}

JSON data: ${JSON.stringify(jsonData, null, 2)}

Oracle context: ${description}

Return ONLY raw JSON that matches the structure above. Do not include any markdown formatting, code blocks, or explanations.

Example outputs:
For price data: 
{"value": 4231435, "decimals": 3, "reasoning": "ETH/USD price from Coinbase - extracted amount field and multiplied by 10^3", "timestamp": 1703123456789, "source": "Coinbase"}
{"value": 422627, "decimals": 2, "reasoning": "ETH/USD price from OKX - found last price in data[0].last and multiplied by 10^2", "timestamp": 1703123456789, "source": "OKX"}

IMPORTANT: The value should be an integer that represents the actual value multiplied by 10^decimals. For example, if ETH price is $4,231.44, use value: 423144, decimals: 2.
CRITICAL: All numeric fields (value, decimals, timestamp) must be integers (whole numbers), not decimals. For example, if ETH price is $4,231.44, use value: 423144, decimals: 2, NOT value: 4231.44.

CRITICAL: When the JSON has nested structures like {"data": [{"last": "4212.79"}]}, you must navigate to data[0].last to get the price value. DO NOT return 0 or null values. Always find the actual numeric price in the data structure. In the reasoning, explain exactly which field you used and how you calculated the value.
`;

  try {
    // The client gets the API key from the environment variable `GEMINI_API_KEY`
    const ai = new GoogleGenAI({});

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking for faster response
        },
      },
    });

    const resultText = response.text!;

    console.log("Gemini response:", resultText);

    // Parse the JSON response from Gemini
    const parsed = JSON.parse(resultText);

    return {
      value: parsed.value,
      decimals: parsed.decimals,
      reasoning: parsed.reasoning,
      timestamp: parsed.timestamp || Date.now(),
      source: parsed.source,
    };
  } catch (error) {
    return {
      value: 0,
      decimals: 2,
      reasoning: description,
      timestamp: Date.now(),
      source: "fallback",
    };
  }
}

export const fallback = {
  value: 0,
  decimals: 0,
  reasoning: `Error fetching data`,
  timestamp: Math.floor(Date.now()),
  source: "error",
};
