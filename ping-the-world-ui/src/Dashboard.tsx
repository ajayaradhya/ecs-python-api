import NeonMetrics from "./components/NeonMetrics";
import NeonRadials from "./components/NeonRadials";
import SparklineGrid from "./components/SparklineGrid";
import TerminalLatency from "./components/TerminalLatency";

export default function Dashboard() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">

      {/* Full width - top */}
      <div className="col-span-1 md:col-span-2">
        <NeonMetrics />
      </div>

      {/* Full width block */}
      <div className="col-span-1 md:col-span-2">
        <NeonRadials />
      </div>

      {/* Side by side on desktop, stacked on mobile */}
      <div className="col-span-1">
        <TerminalLatency />
      </div>

      <div className="col-span-1">
        <SparklineGrid />
      </div>

    </section>
  );
}
