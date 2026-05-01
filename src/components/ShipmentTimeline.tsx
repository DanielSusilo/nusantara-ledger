import { Check, Circle, Clock, MapPin, ExternalLink } from "lucide-react";
import type { Shipment } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ShipmentTimeline({ shipment }: { shipment: Shipment }) {
  return (
    <div className="rounded-2xl border bg-card shadow-elevated overflow-hidden">
      <div className="bg-navy-gradient text-navy-foreground p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-success">Shipment ID</div>
            <div className="font-mono text-2xl font-semibold">{shipment.id}</div>
            <div className="mt-2 text-lg">{shipment.itemName}</div>
            <div className="text-sm text-navy-foreground/70">
              {shipment.quantity.toLocaleString()} units · Owner {shipment.owner}
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-success/20 text-success hover:bg-success/20 border border-success/30">
              On-chain verified
            </Badge>
            <div className="mt-2 text-xs text-navy-foreground/70 flex items-center gap-1 justify-end">
              <MapPin className="size-3" /> {shipment.origin} → {shipment.destination}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <ol className="relative space-y-6">
          {shipment.stages.map((stage, i) => {
            const isLast = i === shipment.stages.length - 1;
            return (
              <li key={stage.name} className="relative pl-12">
                {!isLast && (
                  <span
                    className={cn(
                      "absolute left-[15px] top-8 h-[calc(100%+8px)] w-0.5",
                      stage.status === "completed" ? "bg-success" : "bg-border",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "absolute left-0 top-0 flex size-8 items-center justify-center rounded-full border-2",
                    stage.status === "completed" && "border-success bg-success text-success-foreground",
                    stage.status === "current" && "border-success bg-success/15 text-success animate-pulse",
                    stage.status === "pending" && "border-border bg-muted text-muted-foreground",
                  )}
                >
                  {stage.status === "completed" ? <Check className="size-4" /> :
                   stage.status === "current" ? <Clock className="size-4" /> :
                   <Circle className="size-3" />}
                </span>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">{stage.name}</div>
                    <div className="text-sm text-muted-foreground">{stage.actor} · {stage.location}</div>
                  </div>
                  <div className="text-right text-xs">
                    {stage.timestamp && <div className="text-muted-foreground">{stage.timestamp}</div>}
                    {stage.txHash && (
                      <div className="font-mono text-success flex items-center gap-1 justify-end mt-0.5">
                        {stage.txHash} <ExternalLink className="size-3" />
                      </div>
                    )}
                    {stage.status === "current" && (
                      <Badge variant="outline" className="border-success/40 text-success">Awaiting signature</Badge>
                    )}
                    {stage.status === "pending" && (
                      <span className="text-muted-foreground">Pending</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
