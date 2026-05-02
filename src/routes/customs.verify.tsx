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
  // Items awaiting customs clearance: stage === 2 (Bea Cukai stage)
  const [items, setItems] = useState<Shipment[]>(
    SHIPMENTS.map((s) => ({ ...s, stages: s.stages.map((st) => ({ ...st })) })),
  );
  const [active, setActive] = useState<Shipment | null>(null);
  const [signing, setSigning] = useState(false);
  const [verifiedId, setVerifiedId] = useState<string | null>(null);

  const pending = items.filter((s) => s.currentStage === 2);

  const handleVerify = async () => {
    if (!active) return;
    setSigning(true);
    await new Promise((r) => setTimeout(r, 1800));
    setItems((prev) =>
      prev.map((s) => {
        if (s.id !== active.id) return s;
        const next = Math.min(s.currentStage + 1, 4);
        const stages = s.stages.map((st, i) => ({
          ...st,
          status: i < next ? "completed" : i === next ? "current" : "pending",
          timestamp: i <= next ? (st.timestamp ?? new Date().toLocaleString("id-ID")) : st.timestamp,
          txHash: i < next ? (st.txHash ?? `5x${Math.random().toString(36).slice(2, 10)}`) : st.txHash,
        })) as Shipment["stages"];
        return { ...s, currentStage: next, stages };
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
        <h1 className="text-2xl font-bold">Pending Verifications</h1>
        <p className="text-muted-foreground text-sm">Tanda tangan on-chain untuk meneruskan barang melewati Bea Cukai.</p>
      </div>

      {verifiedId && (
        <div className="rounded-lg border border-success/40 bg-success/5 p-4 flex items-center gap-3">
          <CheckCircle2 className="size-5 text-success" />
          <div>
            <div className="font-medium text-success">Verifikasi tertanda tangan</div>
            <div className="text-xs text-muted-foreground">{verifiedId} sekarang berstatus Cleared.</div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Awaiting Customs ({pending.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item ID</TableHead>
                <TableHead>Goods</TableHead>
                <TableHead>Pengirim</TableHead>
                <TableHead>Origin Port</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{s.itemName}</div>
                    <div className="text-xs text-muted-foreground">{s.quantity} kg</div>
                  </TableCell>
                  <TableCell className="text-sm">{s.sender}</TableCell>
                  <TableCell className="text-sm">{s.stages[2]?.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-warning/40 text-warning">
                      Awaiting Clearance
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => setActive(s)}
                      className="bg-success hover:bg-success/90 text-success-foreground gap-1.5"
                    >
                      <ShieldCheck className="size-3.5" /> Verify &amp; Sign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {pending.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Tidak ada barang yang menunggu klirens. Semua sudah ditandatangani.
                  </TableCell>
                </TableRow>
              )}
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
              Phantom akan meminta tanda tangan kamu untuk merekam klirens on-chain.
            </DialogDescription>
          </DialogHeader>
          {active && (
            <div className="rounded-lg border bg-muted/40 p-4 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground">Item</span><span className="font-mono">{active.id}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Goods</span><span>{active.itemName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Origin Port</span><span>{active.stages[2]?.location}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Action</span><span className="text-success font-medium">Bea Cukai → In Transit</span></div>
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
