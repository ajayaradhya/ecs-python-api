// src/components/NeonGlobe.tsx
import React, { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import type GlobeType from "react-globe.gl";
import axios from "axios";

const BASE_URL = "http://ecs-python-api-dev-alb-304493979.ap-south-2.elb.amazonaws.com";

type CityNode = {
  region: string;
  lat: number;
  lng: number;
  severity: number;
};

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "New York": { lat: 40.7128, lng: -74.0060 },
  "San Francisco": { lat: 37.7749, lng: -122.4194 },
  London: { lat: 51.5072, lng: -0.1276 },
  Frankfurt: { lat: 50.1109, lng: 8.6821 },
  Singapore: { lat: 1.3521, lng: 103.8198 },
  Tokyo: { lat: 35.6762, lng: 139.6503 },
  Sydney: { lat: -33.8688, lng: 151.2093 },
  Dubai: { lat: 25.2048, lng: 55.2708 },
  "São Paulo": { lat: -23.5558, lng: -46.6396 },
  Toronto: { lat: 43.6532, lng: -79.3832 }
};

const severityColor = (s: number) =>
  s === 0 ? "#39ff14" :
  s === 1 ? "#ffff55" :
  s === 2 ? "#ff8800" :
           "#ff0033";


export default function NeonGlobe() {
  const globeRef = useRef<any>(null);
  const [points, setPoints] = useState<CityNode[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Fetch latency → marker severity
  const fetchGlobeData = async () => {
    const res = await axios.get(`${BASE_URL}/ping-world/aggregate`);
    const mapped = res.data.regions.map((r: any) => ({
      region: r.region,
      lat: CITY_COORDS[r.region].lat,
      lng: CITY_COORDS[r.region].lng,
      severity: r.severity
    }));
    setPoints(mapped);
  };

  useEffect(() => {
    fetchGlobeData();
    const interval = setInterval(fetchGlobeData, 5000);
    return () => clearInterval(interval);
  }, []);

  // auto-resize
  useEffect(() => {
    const update = () => setDimensions({ width: window.innerWidth * 0.85, height: 420 });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // camera tuning: disable wheel zoom + pan scroll hijacking
  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.55;
    controls.enableZoom = false;   // disable wheel zoom
    controls.enablePan = false;    // disable click drag scroll
  }, []);

  // ---------------------------------------------------------
  // BUTTON CONTROLS
  // ---------------------------------------------------------
  const zoomIn = () => {
    const c = globeRef.current!.camera();
    c.position.z = Math.max(180, c.position.z - 20);
  };

  const zoomOut = () => {
    const c = globeRef.current!.camera();
    c.position.z = Math.min(480, c.position.z + 20);
  };

  const rotateLeft = () => {
    globeRef.current!.pointOfView({ lng: globeRef.current!.pointOfView().lng - 10 }, 500);
  };

  const rotateRight = () => {
    globeRef.current!.pointOfView({ lng: globeRef.current!.pointOfView().lng + 10 }, 500);
  };

  const resetView = () => {
    globeRef.current!.pointOfView({ lat: 20, lng: 0, altitude: 2.2 }, 800);
  };

  return (
    <div className="relative w-full h-[420px] flex items-center justify-center border border-neon bg-black/30 rounded-2xl shadow-[0_0_35px_#39ff14] overflow-hidden">

      {/* === Globe === */}
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        atmosphereColor="#39ff14"
        atmosphereAltitude={0.22}
        enablePointerInteraction={true}
        pointsData={points}
        pointAltitude={0.04}
        pointRadius={0.5}
        pointColor={(d: any) => severityColor(d.severity)}
      />

      {/* === UI CONTROL PANEL === */}
      <div className="absolute right-4 top-4 space-y-2 flex flex-col">
        <button onClick={zoomIn}  className="px-3 py-1 bg-black/70 border border-neon text-neon font-mono text-xs rounded hover:bg-neon/10">ZOOM +</button>
        <button onClick={zoomOut} className="px-3 py-1 bg-black/70 border border-neon text-neon font-mono text-xs rounded hover:bg-neon/10">ZOOM -</button>
        <button onClick={rotateLeft}  className="px-3 py-1 bg-black/70 border border-neon text-neon font-mono text-xs rounded hover:bg-neon/10">ROTATE ◀</button>
        <button onClick={rotateRight} className="px-3 py-1 bg-black/70 border border-neon text-neon font-mono text-xs rounded hover:bg-neon/10">ROTATE ▶</button>
        <button onClick={resetView} className="px-3 py-1 bg-black/70 border border-neon text-cyanBright font-mono text-xs rounded hover:bg-cyanBright/20">RESET</button>
      </div>
    </div>
  );
}
