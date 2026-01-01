import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Sparklines, SparklinesLine } from "react-sparklines";

const BASE_URL = "http://ecs-python-api-dev-alb-304493979.ap-south-2.elb.amazonaws.com";

type TimeseriesResponse = {
  data: {
    region: string;
    latency_history: number[];
    timestamps: string[];
  }[];
};

const getColor = (val: number) =>
  val < 150 ? "#39ff14" : 
  val < 250 ? "#ffff55" :
  val < 350 ? "#ff8800" :
              "#ff0033";

export default function SparklineGrid() {
  const { data } = useQuery<TimeseriesResponse>({
    queryKey: ["sparkline"],
    queryFn: async () => (await axios.get(`${BASE_URL}/ping-world/timeseries`)).data,
    refetchInterval: 5000,
  });

  if (!data) return <div className="text-neon">Loading live trends...</div>;

  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {data.data.map((city, i) => {
      const latest = city.latency_history[city.latency_history.length - 1];
      return (
        <div
          key={i}
          className="border border-termborder bg-black/40 rounded-xl p-3 shadow-neonGlow hover:shadow-cyanGlow transition"
        >
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{city.region}</span>
            <span style={{ color: getColor(latest) }}>{latest} ms</span>
          </div>

          <Sparklines data={city.latency_history} margin={2}>
            <SparklinesLine
              style={{ strokeWidth: 3, fill: "none" }}
              color={getColor(latest)}
            />
          </Sparklines>
        </div>
      );
    })}
  </div>
);
}
