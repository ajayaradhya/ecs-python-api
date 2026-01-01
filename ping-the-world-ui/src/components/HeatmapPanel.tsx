import { useQuery } from "@tanstack/react-query";
import { fetchHeatmap, HeatmapResponse } from "../api/pingService";

export default function HeatmapPanel() {
  const { data, isLoading } = useQuery<HeatmapResponse>({
    queryKey: ["heatmap"],
    queryFn: fetchHeatmap,
    refetchInterval: 5000,
  });

  if (isLoading || !data) return <div className="text-neonAlt">Loading...</div>;

  return (
    <div className="text-sm space-y-2">
      {Object.entries(data.heatmap).map(([city, status]) => (
        <div key={city} className="flex justify-between border-b border-termborder pb-1">
          <span className="text-neon">{city}</span>
          <span
            className={
              status === "green"  ? "text-neon" :
              status === "yellow" ? "text-warning" :
              status === "orange" ? "text-magenta" :
              "text-white"
            }
          >
            {status.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
}
