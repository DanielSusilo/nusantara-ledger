import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MockMap } from "@/components/MockMap";
import { FLEET } from "@/lib/mock-data";
import { Truck, Activity, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/admin/fleet")({
  component: FleetMap,
});

function FleetMap() {
  const inTransit = FLEET.filter((f) => f.status === "in-transit").length;
  const atCustoms = FLEET.filter((f) => f.status === "at-customs").length;
  const delivered = FLEET.filter((f) => f.status === "delivered").length;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold">Fleet Map Tracking</h1>
        <p className="text-muted-foreground text-sm">Live position of all Dan.s Logistic trucks across Java.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Total Armada", value: FLEET.length, icon: Truck, color: "text-primary", bg: "bg-primary/10" },
          { label: "In Transit", value: inTransit, icon: Activity, color: "text-success", bg: "bg-success/10" },
          { label: "At Customs", value: atCustoms, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
          { label: "Delivered", value: delivered, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`size-10 rounded-lg ${s.bg} ${s.color} flex items-center justify-center`}>
                <s.icon className="size-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className="text-xl font-bold">{s.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <MockMap trucks={FLEET} height="h-[520px]" />

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Truck</th>
                <th className="px-4 py-3 text-left">Driver</th>
                <th className="px-4 py-3 text-left">Shipment</th>
                <th className="px-4 py-3 text-left">Route</th>
                <th className="px-4 py-3 text-left">Speed</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {FLEET.map((f) => (
                <tr key={f.id} className="border-t">
                  <td className="px-4 py-3 font-mono text-xs">{f.plate}</td>
                  <td className="px-4 py-3">{f.driver}</td>
                  <td className="px-4 py-3 font-mono text-xs">{f.id}</td>
                  <td className="px-4 py-3 text-xs">{f.origin} → {f.destination}</td>
                  <td className="px-4 py-3">{f.speedKmh} km/h</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={
                      f.status === "delivered" ? "border-success/50 text-success" :
                      f.status === "in-transit" ? "border-primary/50 text-primary" :
                      "border-warning/50 text-warning"
                    }>
                      {f.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
