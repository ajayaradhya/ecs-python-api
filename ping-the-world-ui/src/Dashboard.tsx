import NeonGlobe from "./components/NeonGlobe";
import NeonMetrics from "./components/NeonMetrics";
import NeonRadials from "./components/NeonRadials";
import SparklineGrid from "./components/SparklineGrid";

export default function Dashboard() {
  return (
    <section className="grid grid-cols-2 gap-6 p-4">

      <div className="col-span-2">
        <NeonGlobe />
      </div>
      <div className="col-span-2">
        <NeonMetrics />
      </div>

      <div className="col-span-2">
        <NeonRadials />   
      </div>

      <div className="col-span-2">
        <SparklineGrid />
      </div>
      


      {/* <div className="panel"><HeatmapPanel /></div>
      <div className="panel"><RegionRanking /></div>
      <div className="panel"><StabilityRadar /></div>
      <div className="panel"><LiveTrendline /></div> */}
    </section>
  );
}
