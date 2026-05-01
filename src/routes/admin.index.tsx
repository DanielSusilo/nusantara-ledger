import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle2, TrendingUp } from "lucide-react";
import { SHIPMENTS, ANALYTICS_BY_MONTH } from "@/lib/mock-data";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const inTransit = SHIPMENTS.filter((s) => s.currentStage > 0 && s.currentStage < 5).length;
  const completed = SHIPMENTS.filter((s) => s.currentStage >= 5).length;

  const metrics = [
    { label: "Total Shipments", value: 2418, delta: "+12.4%", icon: Package, color: "text-primary" },
    { label: "In Transit", value: inTransit * 312, delta: "+5.1%", icon: Truck, color: "text-warning" },
    { label: "Completed Deliveries", value: completed * 481, delta: "+18.2%", icon: CheckCircle2, color: "text-success" },
    { label: "On-chain Verifications", value: 14620, delta: "+22.8%", icon: TrendingUp, color: "text-success" },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, Operator</h1>
        <p className="text-muted-foreground text-sm">Real-time supply chain overview across Indonesian ports.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{m.label}</div>
                <m.icon className={`size-4 ${m.color}`} />
              </div>
              <div className="mt-3 text-3xl font-bold">{m.value.toLocaleString()}</div>
              <div className="mt-1 text-xs text-success">{m.delta} vs last month</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Shipment Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ANALYTICS_BY_MONTH}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.66 0.16 160)" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="oklch(0.66 0.16 160)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.27 0.06 255)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="oklch(0.27 0.06 255)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 255)" />
                  <XAxis dataKey="month" stroke="oklch(0.5 0.02 255)" fontSize={12} />
                  <YAxis stroke="oklch(0.5 0.02 255)" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.91 0.01 255)" }} />
                  <Area type="monotone" dataKey="shipments" stroke="oklch(0.27 0.06 255)" fill="url(#g2)" strokeWidth={2} />
                  <Area type="monotone" dataKey="completed" stroke="oklch(0.66 0.16 160)" fill="url(#g1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Shipments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {SHIPMENTS.slice(0, 4).map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="font-mono text-xs text-muted-foreground">{s.id}</div>
                  <div className="text-sm font-medium truncate max-w-[160px]">{s.itemName}</div>
                </div>
                <Badge variant={s.currentStage >= 5 ? "default" : "outline"}
                  className={s.currentStage >= 5 ? "bg-success text-success-foreground hover:bg-success" : "border-warning/50 text-warning"}>
                  Stage {s.currentStage}/5
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
