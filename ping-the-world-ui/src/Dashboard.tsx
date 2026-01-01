import HeatmapPanel from "./components/HeatmapPanel";
import RegionRanking from "./components/RegionRanking";
import StabilityRadar from "./components/StabilityRadar";
import LiveTrendline from "./components/LiveTrendline";

export default function Dashboard() {
  return (
    <section className="grid grid-cols-2 grid-rows-2 gap-6">
      <div className="panel"><HeatmapPanel /></div>
      <div className="panel"><RegionRanking /></div>
      <div className="panel"><StabilityRadar /></div>
      <div className="panel"><LiveTrendline /></div>
    </section>
  );
}
