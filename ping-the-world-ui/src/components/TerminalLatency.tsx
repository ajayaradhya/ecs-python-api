import { useEffect, useState } from "react";
import axios from "axios";
import "./terminal.css";

// Backend Base URL (same as NeonGlobe)
const BASE_URL = "http://ecs-python-api-dev-alb-304493979.ap-south-2.elb.amazonaws.com";

// Expected data structure returned by API:
type LatencyResult = {
  region: string;
  latency: number;
  status: string; // "OK" | "WARN" | "FAIL" etc.
};

export default function TerminalLatency() {
  const [results, setResults] = useState<LatencyResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // ---------------------------------------------------------
  // Fetch Data (same as NeonGlobe)
  // ---------------------------------------------------------
  const fetchLatencyData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/ping-world/aggregate`);
      // Assuming API response shape:
      // { regions: [ {region, latency, severity}, ... ] }
      const mapped = res.data.regions.map((r: any) => ({
        region: r.region,
        latency: r.latency_ms,         // <-- FIXED FIELD NAME
        status:
          r.severity === 0 ? "OK" :
          r.severity === 1 ? "WARN" :
          "FAIL"
      }));

      setResults(mapped);
      setLoading(false);
    } catch (err: any) {
      console.error("Ping fetch error:", err);
      setError("Failed to load ping data");
      setLoading(false);
    }
  };

  // Initial + Refresh Interval
  useEffect(() => {
    fetchLatencyData();
    const interval = setInterval(fetchLatencyData, 5000);
    return () => clearInterval(interval);
  }, []);

  // ---------------------------------------------------------
  // Helpers: UI Rendering
  // ---------------------------------------------------------
  const getBars = (latency: number) => {
    if (latency < 60) return "███";
    if (latency < 120) return "████";
    if (latency < 200) return "█████";
    return "██████";
  };

  const getStatusClass = (status: string) => {
    if (status === "OK") return "ok";
    if (status === "WARN") return "warn";
    return "fail";
  };

  // ---------------------------------------------------------
  // Render Component
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="terminal-container">
        <div className="terminal-header">PING MONITOR</div>
        <pre className="terminal-body">Loading data...</pre>
      </div>
    );
  }

  if (error) {
    return (
      <div className="terminal-container">
        <div className="terminal-header">PING MONITOR</div>
        <pre className="terminal-body">{error}</pre>
      </div>
    );
  }

  return (
    <div className="terminal-container">
      <div className="terminal-header">PING MONITOR</div>
      <pre className="terminal-body">
        {results.map((r, idx) => (
          <div key={idx} className={`row ${getStatusClass(r.status)}`}>
            {r.region.padEnd(14, " ")}
            {"  "}
            {getBars(r.latency)}
            {"  "}
            {String(r.latency).padEnd(4, " ")}ms
          </div>
        ))}
      </pre>
    </div>
  );
}
