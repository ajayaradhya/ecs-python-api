import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const BASE_URL = "http://ecs-python-api-dev-alb-304493979.ap-south-2.elb.amazonaws.com";

type AggregationResponse = {
  global_average_latency: number;
  global_average_jitter: number;
  global_average_loss: number;
  regions: { severity: number }[];
};

const gaugeColor = (severity: number) =>
  severity === 0 ? "#39ff14" :         // green
  severity === 1 ? "#FFFF55" :         // yellow
  severity === 2 ? "#FF8800" :         // orange
                   "#FF0033";          // red

export default function NeonRadials() {

  const { data } = useQuery<AggregationResponse>({
    queryKey: ["radials"],
    queryFn: async () => (await axios.get(`${BASE_URL}/ping-world/aggregate`)).data,
    refetchInterval: 5000,
  });

  if (!data) return <div className="text-neon">Loading radial gauges...</div>;

  const avgSeverity =
    Math.round(data.regions.reduce((a, b) => a + b.severity, 0) / data.regions.length);

  const latencyScore = Math.max(0, 100 - data.global_average_latency / 4);
  const stabilityScore = Math.max(0, 100 - data.global_average_jitter * 4);
  const lossScore = Math.max(0, 100 - data.global_average_loss * 25);
  const reliabilityScore = Math.round((latencyScore + stabilityScore + lossScore) / 3);

  const gauges = [
    { label: "LATENCY HEALTH", value: latencyScore, color: gaugeColor(avgSeverity) },
    { label: "STABILITY (JITTER)", value: stabilityScore, color: "#08F7FE" },
    { label: "PACKET INTEGRITY", value: lossScore, color: "#FE53BB" },
    { label: "RELIABILITY INDEX", value: reliabilityScore, color: "#39FF14" },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      {gauges.map((g, i) => (
        <div key={i} className="p-4 border border-termborder rounded-2xl bg-black/40 shadow-neonGlow">
          <CircularProgressbarWithChildren
            value={g.value}
            strokeWidth={10}
            styles={buildStyles({
              pathColor: g.color,
              trailColor: "rgba(255,255,255,0.05)",
              strokeLinecap: "round"
            })}
          >
            <div className="text-center font-mono">
              <div className="text-xl" style={{ color: g.color }}>{g.value}%</div>
              <div className="text-xs text-gray-400 tracking-widest">{g.label}</div>
            </div>
          </CircularProgressbarWithChildren>
        </div>
      ))}
    </div>
  );
}
