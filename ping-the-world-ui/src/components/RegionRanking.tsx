import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { fetchAggregate } from "../api/pingService";

export default function RegionRanking() {
  const { data } = useQuery({
    queryKey: ["aggregate"],
    queryFn: fetchAggregate,
    refetchInterval: 5000,
  });

  const formattedData = data?.regions || [];

  return (
    <BarChart width={400} height={250} data={formattedData}>
      <XAxis dataKey="region" stroke="#39ff14" />
      <YAxis stroke="#39ff14" />
      <Tooltip wrapperStyle={{ background: "#0a0a0a", border: "1px solid #39ff14" }} />
      <Bar dataKey="latency_ms" fill="#39ff14" />
    </BarChart>
  );
}
