import React, { useState, useEffect, useCallback } from "react";

export default function App() {
  const AGENT_API_URL = "http://localhost:3000";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [onChainRecord, setOnChainRecord] = useState(null);
  const [isFetchingRecord, setIsFetchingRecord] = useState(true);

  const fetchAgentState = useCallback(async () => {
    setIsFetchingRecord(true);
    setError("");
    try {
      const response = await fetch(`${AGENT_API_URL}/api/state`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.error || `Agent API Error: ${response.statusText}`
        );
      }
      const data = await response.json();
      setOnChainRecord(data);
    } catch (err) {
      setError(err.message);
      setOnChainRecord(null);
    } finally {
      setIsFetchingRecord(false);
    }
  }, []);

  useEffect(() => {
    fetchAgentState();
  }, [fetchAgentState]);

  const handleCommit = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${AGENT_API_URL}/api/commit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Commit failed");
      }

      await response.json();
      setTimeout(fetchAgentState, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (record) => {
    if (!record || !record.value || record.decimals === undefined) return "N/A";
    const price = Number(record.value) / Math.pow(10, record.decimals);
    return price.toFixed(record.decimals);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>NEAR Price Oracle</h1>
      <p>via Shade Agent</p>

      <div style={{ marginTop: "20px" }}>
        <h2>Last Recorded Price</h2>

        {isFetchingRecord ? (
          <p>Loading...</p>
        ) : onChainRecord ? (
          <div>
            <h3 style={{ fontSize: "24px", color: "blue" }}>
              ${formatPrice(onChainRecord)}
            </h3>
            <p style={{ fontSize: "12px", color: "gray" }}>
              {new Date(onChainRecord.timestamp).toLocaleString()}
            </p>
            {onChainRecord.source && (
              <p style={{ fontSize: "12px", color: "gray" }}>
                Source: {onChainRecord.source}
              </p>
            )}
          </div>
        ) : (
          <p>No data on-chain.</p>
        )}
      </div>

      <button
        onClick={handleCommit}
        disabled={isLoading || isFetchingRecord}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: isLoading ? "gray" : "blue",
          color: "white",
          border: "none",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Updating..." : "Update Price"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}
