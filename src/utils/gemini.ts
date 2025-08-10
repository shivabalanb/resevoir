import { GoogleGenAI } from "@google/genai";

export async function parseJsonWithGemini(
  jsonData: any,
  description: string
): Promise<{
  value: number;
  decimals: number;
  description: string;
  timestamp: number;
  source: string;
}> {
  const prompt = `
Parse this JSON data and extract the relevant information to fit this structure:
{
  "value": integer (the numeric value as a whole number, multiply by 10^decimals),
  "decimals": integer (decimal places, typically 2-8),
  "description": string (human readable description),
  "timestamp": integer (Unix timestamp in milliseconds as whole number),
  "source": string (data source name)
}

JSON data: ${JSON.stringify(jsonData, null, 2)}

Description: ${description}

Return ONLY raw JSON that matches the structure above. Do not include any markdown formatting, code blocks, or explanations.

Example outputs:
For price data: 
{"value": 4231435, "decimals": 3, "description": "ETH/USD price from Coinbase", "timestamp": 1703123456789, "source": "Coinbase"}
{"value": 422627, "decimals": 2, "description": "ETH/USD price from OKX", "timestamp": 1703123456789, "source": "OKX"}
IMPORTANT: The value should be an integer that represents the actual value multiplied by 10^decimals. For example, if ETH price is $4,231.44, use value: 423144, decimals: 2.
CRITICAL: All numeric fields (value, decimals, timestamp) must be integers (whole numbers), not decimals. For example, if ETH price is $4,231.44, use value: 423144, decimals: 2, NOT value: 4231.44.
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

    const resultText = response.text;

    if (!resultText) {
      throw new Error("No response text from Gemini");
    }

    console.log("Gemini response:", resultText);

    // Parse the JSON response from Gemini
    const parsed = JSON.parse(resultText);

    return {
      value: parsed.value,
      decimals: parsed.decimals,
      description: parsed.description,
      timestamp: parsed.timestamp || Date.now(),
      source: parsed.source,
    };
  } catch (error) {
    console.error("Gemini parsing error:", error);
    // Fallback to basic parsing
    return {
      value: 0,
      decimals: 2,
      description: description,
      timestamp: Date.now(),
      source: "fallback",
    };
  }
}
