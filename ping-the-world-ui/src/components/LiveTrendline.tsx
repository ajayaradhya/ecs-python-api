import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { fetchTimeseries } from "../api/pingService";

export default function LiveTrendline() {
  const { data } = useQuery({
    queryKey: ["timeseries"],
    queryFn: fetchTimeseries,
    refetchInterval: 6000,
  });

  return (
    <LineChart width={400} height={250} data={data?.data || []}>
      <XAxis dataKey="region" stroke="#39ff14" />
      <YAxis stroke="#39ff14" />
      <Tooltip wrapperStyle={{ background: "#0a0a0a", border: "1px solid #39ff14" }} />
      <Line type="monotone" dataKey="latency_history[0]" stroke="#FF4D4D" />
    </LineChart>
  );
}
