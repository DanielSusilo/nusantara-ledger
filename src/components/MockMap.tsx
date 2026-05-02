import { Truck, MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface FleetTruck {
  id: string;
  plate: string;
  lat: number;
  lng: number;
  status: string;
  origin?: string;
  destination?: string;
}

interface MockMapProps {
  trucks: FleetTruck[];
  height?: string;
  highlightId?: string;
}

// Bounding box roughly covering Java
const BOUNDS = { minLat: -8.6, maxLat: -5.8, minLng: 105.5, maxLng: 114.5 };

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x: Math.max(2, Math.min(98, x)), y: Math.max(4, Math.min(96, y)) };
}

export function MockMap({ trucks, height = "h-[420px]", highlightId }: MockMapProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border bg-navy-gradient",
        height,
      )}
    >
      {/* Grid pattern */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.18]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Stylized Java island shape */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M 4 58 Q 15 48 28 52 Q 38 50 48 56 Q 60 54 70 58 Q 82 56 95 62 L 95 72 Q 80 74 68 70 Q 55 74 42 70 Q 28 72 16 68 Q 8 66 4 62 Z"
          fill="oklch(0.66 0.16 160 / 0.2)"
          stroke="oklch(0.66 0.16 160 / 0.6)"
          strokeWidth="0.3"
        />
        <text x="50" y="84" fill="white" fillOpacity="0.4" fontSize="3" textAnchor="middle" fontFamily="monospace">
          PULAU JAWA · INDONESIA
        </text>
      </svg>

      {/* Major city dots */}
      {[
        { name: "Jakarta", lat: -6.2, lng: 106.85 },
        { name: "Semarang", lat: -6.97, lng: 110.42 },
        { name: "Surabaya", lat: -7.25, lng: 112.75 },
        { name: "Yogyakarta", lat: -7.79, lng: 110.36 },
      ].map((c) => {
        const { x, y } = project(c.lat, c.lng);
        return (
          <div
            key={c.name}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] text-white/70"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="flex flex-col items-center gap-0.5">
              <MapPin className="size-3 text-white/50" />
              <span className="font-mono">{c.name}</span>
            </div>
          </div>
        );
      })}

      {/* Trucks */}
      {trucks.map((t) => {
        const { x, y } = project(t.lat, t.lng);
        const highlighted = !highlightId || highlightId === t.id;
        return (
          <div
            key={t.id}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 group",
              !highlighted && "opacity-40",
            )}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="relative">
              <span className="absolute inset-0 -m-2 rounded-full bg-success/40 animate-ping" />
              <div className="relative flex size-9 items-center justify-center rounded-full bg-success text-success-foreground shadow-glow border-2 border-white">
                <Truck className="size-4" />
              </div>
            </div>
            <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {t.plate}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 rounded-lg bg-black/40 backdrop-blur px-3 py-2 text-xs text-white/90 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-success animate-pulse" />
          Live truck
        </div>
        <div className="flex items-center gap-1.5">
          <Navigation className="size-3" /> {trucks.length} active
        </div>
      </div>
    </div>
  );
}
