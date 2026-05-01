import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { SHIPMENTS, type Shipment } from "@/lib/mock-data";
import { Loader2, ShieldCheck, CheckCircle2, FileSignature } from "lucide-react";

export const Route = createFileRoute("/customs/verify")({
  component: VerifyGoods,
});

function VerifyGoods() {
  const [items, setItems] = useState<Shipment[]>(
    SHIPMENTS.map((s) => ({ ...s, stages: s.stages.map((st) => ({ ...st })) })),
  );
  const [active, setActive] = useState<Shipment | null>(null);
  const [signing, setSigning] = useState(false);
  const [verifiedId, setVerifiedId] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!active) return;
    setSigning(true);
    await new Promise((r) => setTimeout(r, 1800));
    setItems((prev) =>
      prev.map((s) => {
        if (s.id !== active.id) return s;
        const next = s.currentStage + 1;
        const stages = s.stages.map((st, i) => ({
          ...st,
          status: i < next ? "completed" : i === next ? "current" : "pending",
        })) as Shipment["stages"];
        return { ...s, currentStage: Math.min(next, 5), stages };
      }),
    );
    setSigning(false);
    setVerifiedId(active.id);
    setActive(null);
    setTimeout(() => setVerifiedId(null), 4000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold">Verify Goods</h1>
        <p className="text-muted-foreground text-sm">Sign on-chain to advance shipments through customs stages.</p>
      </div>

      {verifiedId && (
        <div className="rounded-lg border border-success/40 bg-success/5 p-4 flex items-center gap-3">
          <CheckCircle2 className="size-5 text-success" />
          <div>
            <div className="font-medium text-success">Verification signed</div>
            <div className="text-xs text-muted-foreground">{verifiedId} advanced to the next stage.</div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Pending Verifications ({items.filter(i => i.currentStage < 5).length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item ID</TableHead>
                <TableHead>Goods</TableHead>
                <TableHead>Origin Port</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((s) => {
                const completed = s.currentStage >= 5;
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{s.itemName}</div>
                      <div className="text-xs text-muted-foreground">{s.quantity.toLocaleString()} units</div>
                    </TableCell>
                    <TableCell className="text-sm">{s.origin}</TableCell>
                    <TableCell>
                      {completed ? (
                        <Badge className="bg-success text-success-foreground hover:bg-success">Delivered</Badge>
                      ) : (
                        <Badge variant="outline" className="border-warning/40 text-warning">
                          {s.currentStage + 1}/6 · {s.stages[s.currentStage].name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        disabled={completed}
                        onClick={() => setActive(s)}
                        className="bg-success hover:bg-success/90 text-success-foreground gap-1.5"
                      >
                        <ShieldCheck className="size-3.5" /> Verify &amp; Sign
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSignature className="size-5 text-success" />
              Wallet Signature Request
            </DialogTitle>
            <DialogDescription>
              Phantom wallet will request your signature to advance this shipment on-chain.
            </DialogDescription>
          </DialogHeader>
          {active && (
            <div className="rounded-lg border bg-muted/40 p-4 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground">Item</span><span className="font-mono">{active.id}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Goods</span><span>{active.itemName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">From stage</span><span>{active.stages[active.currentStage].name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">To stage</span>
                <span className="text-success font-medium">{active.stages[Math.min(active.currentStage + 1, 5)]?.name}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2"><span className="text-muted-foreground">Estimated gas</span><span className="font-mono text-xs">~0.00009 SOL</span></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActive(null)} disabled={signing}>Reject</Button>
            <Button onClick={handleVerify} disabled={signing} className="bg-success hover:bg-success/90 text-success-foreground gap-2">
              {signing ? <><Loader2 className="size-4 animate-spin" /> Signing...</> : <><ShieldCheck className="size-4" /> Approve &amp; Sign</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
