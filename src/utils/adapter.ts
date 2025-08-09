export async function fetchData() {
  const r = await fetch(
    "https://www.okx.com/api/v5/market/ticker?instId=ETH-USDT"
  );
  const j = await r.json();
  const usd = j.data[0].last as number;
  return {
    value: Math.round(usd * 100),
    decimals: 2,
    timestamp: Date.now(),
    source: "okx",
  };
}
