import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2, FileSignature } from "lucide-react";

export const Route = createFileRoute("/admin/add-item")({
  component: AddItem,
});

const PORTS = ["Tanjung Emas, Semarang", "Tanjung Priok, Jakarta", "Tanjung Perak, Surabaya", "Belawan, Medan"];

function AddItem() {
  const [signing, setSigning] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", quantity: "", origin: "Tanjung Emas, Semarang", destination: "", notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigning(true);
    setSuccess(null);
    await new Promise((r) => setTimeout(r, 2200));
    const newId = `TRX-${Math.floor(8833 + Math.random() * 100)}`;
    setSigning(false);
    setSuccess(newId);
    setForm({ name: "", quantity: "", origin: "Tanjung Emas, Semarang", destination: "", notes: "" });
  };

  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Register New Shipment</h1>
        <p className="text-muted-foreground text-sm">Submit goods to the on-chain manifest. Requires wallet signature.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shipment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input id="name" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Coffee Beans, Palm Oil..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qty">Quantity (units)</Label>
                <Input id="qty" type="number" required value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="1200" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Port of Origin</Label>
                <Select value={form.origin} onValueChange={(v) => setForm({ ...form, origin: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PORTS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dest">Destination</Label>
                <Input id="dest" required value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  placeholder="Port of Rotterdam, NL" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" rows={3} value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Special handling, certifications..." />
            </div>

            <div className="rounded-lg border bg-muted/40 p-4 text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between"><span>Estimated gas</span><span className="font-mono">~0.00012 SOL</span></div>
              <div className="flex justify-between"><span>Smart Contract</span><span className="font-mono">LogiX1...8FvP</span></div>
              <div className="flex justify-between"><span>Network</span><span className="font-mono">Solana Devnet</span></div>
            </div>

            {success && (
              <div className="rounded-lg border border-success/40 bg-success/5 p-4 flex items-start gap-3">
                <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-success">Shipment registered on-chain</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Item ID <span className="font-mono text-foreground">{success}</span> · Tx <span className="font-mono">5x{Math.random().toString(36).slice(2, 12)}</span>
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" disabled={signing}
              className="w-full sm:w-auto bg-success hover:bg-success/90 text-success-foreground gap-2">
              {signing
                ? <><Loader2 className="size-4 animate-spin" /> Signing Transaction...</>
                : <><FileSignature className="size-4" /> Sign &amp; Register</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
