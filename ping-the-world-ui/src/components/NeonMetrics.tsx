import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";

const BASE_URL = "http://ecs-python-api-dev-alb-304493979.ap-south-2.elb.amazonaws.com";

type AggregationResponse = {
  fastest_region: string;
  slowest_region: string;
  global_average_latency: number;
  global_average_jitter: number;
  global_average_loss: number;
  regions: { region: string; latency_ms: number; severity: number }[];
  timestamp: string;
};

const getColor = (severity: number) =>
  severity === 0 ? "text-neon" :
  severity === 1 ? "text-yellow-300" :
  severity === 2 ? "text-orange-400" :
  "text-red-500";

export default function NeonMetrics() {
  const { data } = useQuery<AggregationResponse>({
    queryKey: ["metrics"],
    queryFn: async () => (await axios.get(`${BASE_URL}/ping-world/aggregate`)).data,
    refetchInterval: 5000,
  });

  if (!data) return <div className="text-neon">Loading metrics...</div>;

  const fast = data.regions[0];
  const slow = data.regions[data.regions.length - 1];

  const tiles = [
    { label: "FASTEST REGION", value: fast.region, color: getColor(fast.severity) },
    { label: "SLOWEST REGION", value: slow.region, color: getColor(slow.severity) },
    { label: "AVG LATENCY", value: `${Math.round(data.global_average_latency)} ms`, color: "text-cyanBright" },
    { label: "AVG JITTER", value: `${data.global_average_jitter.toFixed(1)} ms`, color: "text-magenta" },
    { label: "AVG LOSS", value: `${data.global_average_loss.toFixed(2)} %`, color: "text-warning" },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {tiles.map((t, i) => (
        <motion.div
          key={i}
          className={`border border-termborder rounded-xl p-4 text-center font-mono bg-black/40 shadow-neonGlow`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 + i * 0.1 }}
        >
          <div className="text-xs text-gray-400 tracking-wider">{t.label}</div>
          <div className={`text-2xl font-bold ${t.color}`}>{t.value}</div>
        </motion.div>
      ))}
    </div>
  );
}
