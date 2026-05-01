import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ANALYTICS_BY_MONTH } from "@/lib/mock-data";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";

export const Route = createFileRoute("/admin/analytics")({
  component: Analytics,
});

const PORT_DATA = [
  { name: "Tanjung Priok", value: 1042 },
  { name: "Tanjung Perak", value: 681 },
  { name: "Tanjung Emas", value: 478 },
  { name: "Belawan", value: 217 },
];

const COLORS = ["oklch(0.27 0.06 255)", "oklch(0.66 0.16 160)", "oklch(0.55 0.05 255)", "oklch(0.78 0.15 75)"];

function Analytics() {
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm">Operational insights across the network.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Monthly Throughput</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ANALYTICS_BY_MONTH}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 255)" />
                  <XAxis dataKey="month" fontSize={12} stroke="oklch(0.5 0.02 255)" />
                  <YAxis fontSize={12} stroke="oklch(0.5 0.02 255)" />
                  <Tooltip contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="shipments" fill="oklch(0.27 0.06 255)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="completed" fill="oklch(0.66 0.16 160)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Volume by Port</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PORT_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    innerRadius={60} outerRadius={100} paddingAngle={2}>
                    {PORT_DATA.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Avg Customs Clearance", value: "4.2 hrs", delta: "−18% vs Q4" },
          { label: "Verification Rate", value: "99.7%", delta: "+0.3 pts" },
          { label: "Avg Transit Time", value: "11.6 days", delta: "−1.2 days" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className="mt-2 text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-success mt-1">{s.delta}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
