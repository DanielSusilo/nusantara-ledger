import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { formatIDR } from "@/lib/mock-data";

interface QrisModalProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  fee: number;
  shipmentId: string;
  onPaid: () => void;
}

// Mock QRIS pseudo-pattern
function QrisCode({ seed }: { seed: string }) {
  const cells = Array.from({ length: 25 * 25 }, (_, i) => {
    const h = (seed.charCodeAt(i % seed.length) * (i + 7)) % 97;
    return h % 3 !== 0;
  });
  return (
    <div className="relative grid grid-cols-25 gap-px bg-white p-3 rounded-xl" style={{ gridTemplateColumns: "repeat(25, minmax(0, 1fr))" }}>
      {cells.map((on, i) => (
        <div key={i} className={on ? "bg-navy aspect-square" : "bg-white aspect-square"} />
      ))}
      {/* Position markers */}
      {[
        "top-3 left-3",
        "top-3 right-3",
        "bottom-3 left-3",
      ].map((pos) => (
        <div key={pos} className={`absolute ${pos} size-12 border-[6px] border-navy bg-white p-1`}>
          <div className="size-full bg-navy" />
        </div>
      ))}
      {/* QRIS center logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white px-3 py-1.5 rounded-md border-2 border-navy">
          <span className="font-bold text-navy text-sm tracking-wider">QRIS</span>
        </div>
      </div>
    </div>
  );
}

export function QrisModal({ open, onOpenChange, fee, shipmentId, onPaid }: QrisModalProps) {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePay = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1600));
    setPaying(false);
    setPaid(true);
    setTimeout(() => {
      onPaid();
      onOpenChange(false);
      setPaid(false);
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!paying) onOpenChange(o); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="font-bold text-primary tracking-wider">QRIS</span>
            <span>Pembayaran Pengiriman</span>
          </DialogTitle>
          <DialogDescription>
            Scan kode QRIS dengan aplikasi bank/e-wallet kamu untuk membayar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border bg-slate-surface p-4">
            <div className="flex items-center justify-between text-xs">
              <div>
                <div className="text-muted-foreground uppercase tracking-wider">Shipment</div>
                <div className="font-mono text-sm">{shipmentId}</div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground uppercase tracking-wider">Total</div>
                <div className="font-bold text-lg text-primary">{formatIDR(fee)}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            {paid ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="size-16 rounded-full bg-success/15 flex items-center justify-center">
                  <CheckCircle2 className="size-9 text-success" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-success">Pembayaran berhasil</div>
                  <div className="text-xs text-muted-foreground">Mencatat ke blockchain...</div>
                </div>
              </div>
            ) : (
              <QrisCode seed={shipmentId} />
            )}
          </div>

          {!paid && (
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
              <span>Merchant: Dan.s Logistic</span>
              <span className="font-mono">NMID: ID12453667</span>
            </div>
          )}

          {!paid && (
            <Button
              onClick={handlePay}
              disabled={paying}
              className="w-full bg-success hover:bg-success/90 text-success-foreground"
            >
              {paying ? (
                <><Loader2 className="size-4 animate-spin" /> Memverifikasi pembayaran...</>
              ) : (
                "Simulate Payment Success"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
