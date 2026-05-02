import { Check, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Shipment } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export function CustomerStepper({ shipment }: { shipment: Shipment }) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Status pengiriman</div>
          <div className="font-mono font-semibold text-lg">{shipment.id}</div>
        </div>
        <Badge className="bg-success/15 text-success hover:bg-success/15 border border-success/30">
          On-chain verified
        </Badge>
      </div>

      <ol className="relative space-y-5">
        {shipment.stages.map((stage, i) => {
          const isLast = i === shipment.stages.length - 1;
          return (
            <li key={stage.name} className="relative pl-11">
              {!isLast && (
                <span
                  className={cn(
                    "absolute left-[15px] top-8 h-[calc(100%+0px)] w-0.5",
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
                {stage.status === "completed" ? (
                  <Check className="size-4" />
                ) : stage.status === "current" ? (
                  <Clock className="size-4" />
                ) : (
                  <Circle className="size-3" />
                )}
              </span>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="font-medium">{stage.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {stage.actor} · {stage.location}
                  </div>
                </div>
                <div className="text-right text-xs">
                  {stage.timestamp && <div className="text-muted-foreground">{stage.timestamp}</div>}
                  {stage.txHash && (
                    <div className="font-mono text-success mt-0.5">{stage.txHash}</div>
                  )}
                  {stage.status === "current" && (
                    <Badge variant="outline" className="border-success/40 text-success mt-0.5">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
