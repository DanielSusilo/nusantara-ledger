import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle2, Coins } from "lucide-react";
import { SHIPMENTS, ANALYTICS_BY_MONTH, formatIDR } from "@/lib/mock-data";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Nusantara Logistic" },
      { name: "description", content: "Ringkasan real-time pengiriman, pendapatan QRIS, dan kliring Bea Cukai Nusantara Logistic." },
      { property: "og:title", content: "Admin Dashboard — Nusantara Logistic" },
      { property: "og:description", content: "Ringkasan real-time pengiriman, pendapatan QRIS, dan kliring Bea Cukai Nusantara Logistic." },
    ],
  }),
  component: AdminHome,
});

function AdminHome() {
  const totalRevenue = SHIPMENTS.reduce((s, x) => s + x.fee, 0) * 312;
  const pendingClearance = SHIPMENTS.filter((s) => s.currentStage === 2).length;
  const inTransit = SHIPMENTS.filter((s) => s.currentStage === 3).length;

  const metrics = [
    { label: "Total Shipments", value: 2418, delta: "+12.4%", icon: Package, color: "text-primary" },
    { label: "QRIS Revenue", value: formatIDR(totalRevenue), delta: "+18.7%", icon: Coins, color: "text-success", isText: true },
    { label: "Pending Clearance", value: pendingClearance * 47, delta: "−5.2%", icon: Truck, color: "text-warning" },
    { label: "Delivered (mtd)", value: 1842, delta: "+9.1%", icon: CheckCircle2, color: "text-success" },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, Operator</h1>
        <p className="text-muted-foreground text-sm">Real-time supply chain overview · Nusantara Logistic Indonesia.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{m.label}</div>
                <m.icon className={`size-4 ${m.color}`} />
              </div>
              <div className="mt-3 text-2xl font-bold">
                {m.isText ? m.value : (m.value as number).toLocaleString()}
              </div>
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
            {SHIPMENTS.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="min-w-0">
                  <div className="font-mono text-xs text-muted-foreground">{s.id}</div>
                  <div className="text-sm font-medium truncate max-w-[160px]">{s.itemName}</div>
                </div>
                <Badge variant="outline"
                  className={s.currentStage >= 4 ? "border-success/50 text-success" : "border-warning/50 text-warning"}>
                  {s.stages[s.currentStage]?.name ?? "Done"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
