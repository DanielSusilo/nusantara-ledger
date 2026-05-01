import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Clock, FileCheck2, ArrowRight } from "lucide-react";
import { SHIPMENTS } from "@/lib/mock-data";

export const Route = createFileRoute("/customs/")({
  component: CustomsHome,
});

function CustomsHome() {
  const pending = SHIPMENTS.filter((s) => s.currentStage > 0 && s.currentStage < 5);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold">Customs &amp; Verification</h1>
        <p className="text-muted-foreground text-sm">Bea Cukai dashboard. Sign clearances at Indonesian ports.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Pending Verifications", value: pending.length, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
          { label: "Cleared This Week", value: 87, icon: FileCheck2, color: "text-success", bg: "bg-success/10" },
          { label: "Signatures On-chain", value: 4218, icon: ShieldCheck, color: "text-primary", bg: "bg-primary/10" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`size-12 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                <s.icon className="size-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className="text-2xl font-bold">{s.value.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-semibold">Awaiting your signature</div>
            <div className="text-sm text-muted-foreground">
              {pending.length} shipments are ready at customs checkpoints.
            </div>
          </div>
          <Button asChild className="bg-success hover:bg-success/90 text-success-foreground gap-2">
            <Link to="/customs/verify">Verify now <ArrowRight className="size-4" /></Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        <h2 className="font-semibold">Recent activity</h2>
        {pending.slice(0, 4).map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="font-mono text-xs text-muted-foreground">{s.id}</div>
                <div className="font-medium">{s.itemName}</div>
                <div className="text-xs text-muted-foreground">{s.origin}</div>
              </div>
              <Badge variant="outline" className="border-warning/40 text-warning">
                Stage {s.currentStage}: {s.stages[s.currentStage].name}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
