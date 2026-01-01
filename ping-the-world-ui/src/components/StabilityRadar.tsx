import { useQuery } from "@tanstack/react-query";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis } from "recharts";
import { fetchStability } from "../api/pingService";

export default function StabilityRadar() {
  const { data } = useQuery({
    queryKey: ["stability"],
    queryFn: fetchStability,
    refetchInterval: 5000,
  });

  if (!data) return null;

  return (
    <RadarChart width={400} height={250} data={data}>
      <PolarGrid stroke="#39ff14" />
      <PolarAngleAxis dataKey="region" stroke="#39ff14" />
      <Radar dataKey="reliability_score" stroke="#08F7FE" fill="#08F7FE" fillOpacity={0.5} />
    </RadarChart>
  );
}
