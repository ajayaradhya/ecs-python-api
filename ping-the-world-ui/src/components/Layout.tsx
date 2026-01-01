import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-wrapper">
      <header className="text-4xl text-cyanBright drop-shadow mb-4 tracking-wider">
        PING-THE-WORLD
        <div className="text-neonAlt text-xs mt-1">Global Latency Telemetry Console</div>
      </header>

      {children}

      <footer className="text-neonAlt text-xs opacity-60 mt-10 pt-4 border-t border-termborder">
        Deployed via ECS Fargate · Region: ap-south-2 · {new Date().toISOString()}
      </footer>
    </div>
  );
}
