import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Truck, ShieldCheck, Anchor, Package, ArrowRight, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PublicNav } from "@/components/PublicNav";
import { CustomerStepper } from "@/components/CustomerStepper";
import { MockMap } from "@/components/MockMap";
import { QrisModal } from "@/components/QrisModal";
import { SHIPMENTS, formatIDR, type Shipment } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dan.s Logistic — Pengiriman Barang On-chain Indonesia" },
      { name: "description", content: "Kirim, bayar via QRIS, dan lacak pengiriman di seluruh Indonesia. Diverifikasi langsung oleh Bea Cukai dengan tanda tangan blockchain." },
      { property: "og:title", content: "Dan.s Logistic — Pengiriman Barang On-chain Indonesia" },
      { property: "og:description", content: "Kirim, bayar via QRIS, dan lacak pengiriman dengan transparansi blockchain." },
    ],
  }),
  component: LandingPage,
});

const ORIGINS = [
  "Semarang, Jawa Tengah",
  "Jakarta",
  "Surabaya, Jawa Timur",
  "Yogyakarta",
  "Pekalongan, Jawa Tengah",
];

function calcFee(weightKg: number) {
  // Mock pricing: 50k base + 5k/kg, rounded to 1k
  const f = 50000 + Math.max(1, weightKg) * 5000;
  return Math.round(f / 1000) * 1000;
}

function LandingPage() {
  // Tracking state
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [trackError, setTrackError] = useState("");

  // Customer-created shipments (in-memory)
  const [created, setCreated] = useState<Shipment[]>([]);
  const all = useMemo(() => [...created, ...SHIPMENTS], [created]);

  // Form
  const [form, setForm] = useState({
    origin: "Semarang, Jawa Tengah",
    destination: "",
    senderName: "",
    senderPhone: "",
    receiverName: "",
    receiverPhone: "",
    item: "",
    weight: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [pendingShipment, setPendingShipment] = useState<Shipment | null>(null);
  const [qrisOpen, setQrisOpen] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const fee = form.weight ? calcFee(parseFloat(form.weight) || 0) : 0;

  const handleTrack = (e?: React.FormEvent) => {
    e?.preventDefault();
    const id = query.trim().toUpperCase();
    if (!id) return;
    const found = all.find((s) => s.id === id);
    if (found) {
      setActiveId(found.id);
      setTrackError("");
      setTimeout(() => document.getElementById("track-result")?.scrollIntoView({ behavior: "smooth" }), 50);
    } else {
      setTrackError(`ID "${id}" tidak ditemukan. Coba: ${SHIPMENTS.slice(0, 3).map((s) => s.id).join(", ")}`);
      setActiveId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    const id = `DNS-${9000 + Math.floor(Math.random() * 900)}`;
    const weight = parseFloat(form.weight) || 1;
    const newShipment: Shipment = {
      id,
      itemName: form.item,
      quantity: weight,
      origin: form.origin,
      destination: form.destination,
      sender: form.senderName,
      receiver: form.receiverName,
      fee: calcFee(weight),
      currentStage: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      truck: { lat: -7.0, lng: 110.42, label: "B XXXX DNS" },
      stages: [
        { name: "Ordered", actor: "Dan.s Logistic", location: form.origin, status: "current", timestamp: new Date().toLocaleString("id-ID") },
        { name: "Paid (QRIS)", actor: "QRIS · BI-FAST", location: "Online Payment", status: "pending" },
        { name: "Bea Cukai Clearance", actor: "Bea Cukai", location: "Port Customs", status: "pending" },
        { name: "In Transit", actor: "Fleet Driver", location: "On Route", status: "pending" },
        { name: "Delivered", actor: "Receiver", location: form.destination, status: "pending" },
      ],
    };
    setSubmitting(false);
    setPendingShipment(newShipment);
    setQrisOpen(true);
  };

  const handlePaid = () => {
    if (!pendingShipment) return;
    const advanced: Shipment = {
      ...pendingShipment,
      currentStage: 1,
      stages: pendingShipment.stages.map((s, i) => ({
        ...s,
        status: i < 1 ? "completed" : i === 1 ? "current" : "pending",
        timestamp: i <= 1 ? new Date().toLocaleString("id-ID") : s.timestamp,
        txHash: i < 1 ? `5x${Math.random().toString(36).slice(2, 10)}` : s.txHash,
      })) as Shipment["stages"],
    };
    setCreated((prev) => [advanced, ...prev]);
    setSuccessId(advanced.id);
    setPendingShipment(null);
    setForm({
      origin: "Semarang, Jawa Tengah", destination: "", senderName: "", senderPhone: "",
      receiverName: "", receiverPhone: "", item: "", weight: "",
    });
    setQuery(advanced.id);
    setActiveId(advanced.id);
    setTimeout(() => document.getElementById("track-result")?.scrollIntoView({ behavior: "smooth" }), 200);
  };

  const shipment = all.find((s) => s.id === activeId);

  return (
    <div className="min-h-screen">
      <PublicNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-20 sm:pt-24">
          <div className="max-w-3xl">
            <Badge className="bg-success/15 text-success hover:bg-success/15 border border-success/30 rounded-full px-3 py-1">
              <span className="size-1.5 rounded-full bg-success mr-2 animate-pulse" />
              Live · 2.418 pengiriman tercatat on-chain
            </Badge>
            <h1 className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight">
              Kirim barang.<br />
              <span className="text-gradient-emerald">Bayar QRIS. Lacak on-chain.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              Dan.s Logistic menggabungkan kemudahan pembayaran QRIS dengan transparansi blockchain. Bea Cukai menandatangani kliring secara digital — semua tercatat.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-success hover:bg-success/90 text-success-foreground">
                <a href="#create">Buat Pengiriman <ArrowRight className="size-4" /></a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#track">Lacak Paket</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Create + Track grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16 grid gap-6 lg:grid-cols-2">
        {/* Create form */}
        <Card id="create" className="overflow-hidden">
          <div className="bg-navy-gradient text-navy-foreground p-6">
            <div className="text-xs uppercase tracking-widest text-success">Form Pengiriman</div>
            <h2 className="text-2xl font-bold mt-1">Kirim Sekarang</h2>
            <p className="text-sm text-navy-foreground/70 mt-1">Isi detail di bawah, bayar via QRIS, dan langsung tercatat on-chain.</p>
          </div>
          <CardContent className="p-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Origin</Label>
                  <select
                    value={form.origin}
                    onChange={(e) => setForm({ ...form, origin: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
                  >
                    {ORIGINS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Destination</Label>
                  <Input required value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    placeholder="Surakarta, Jawa Tengah" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Pengirim</Label>
                  <Input required value={form.senderName}
                    onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                    placeholder="Budi Santoso" />
                  <Input required value={form.senderPhone}
                    onChange={(e) => setForm({ ...form, senderPhone: e.target.value })}
                    placeholder="0812-3456-7890" />
                </div>
                <div className="space-y-1.5">
                  <Label>Penerima</Label>
                  <Input required value={form.receiverName}
                    onChange={(e) => setForm({ ...form, receiverName: e.target.value })}
                    placeholder="CV Kopi Solo" />
                  <Input required value={form.receiverPhone}
                    onChange={(e) => setForm({ ...form, receiverPhone: e.target.value })}
                    placeholder="0271-555-1234" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Item</Label>
                  <Input required value={form.item}
                    onChange={(e) => setForm({ ...form, item: e.target.value })}
                    placeholder="Kopi Arabica Gayo" />
                </div>
                <div className="space-y-1.5">
                  <Label>Berat (kg)</Label>
                  <Input required type="number" min="1" value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    placeholder="10" />
                </div>
              </div>

              {fee > 0 && (
                <div className="rounded-lg border bg-slate-surface p-3 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">Estimasi biaya pengiriman</div>
                  <div className="font-bold text-primary">{formatIDR(fee)}</div>
                </div>
              )}

              <Button type="submit" disabled={submitting}
                className="w-full bg-success hover:bg-success/90 text-success-foreground">
                {submitting ? <><Loader2 className="size-4 animate-spin" /> Memproses...</> : "Lanjut ke Pembayaran QRIS"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Track */}
        <Card id="track" className="overflow-hidden">
          <div className="bg-navy-gradient text-navy-foreground p-6">
            <div className="text-xs uppercase tracking-widest text-success">Lacak Pengiriman</div>
            <h2 className="text-2xl font-bold mt-1">Cek Status Real-time</h2>
            <p className="text-sm text-navy-foreground/70 mt-1">Masukkan Item ID untuk melihat lokasi truk dan tahap pengiriman.</p>
          </div>
          <CardContent className="p-6 space-y-5">
            <form onSubmit={handleTrack}>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-2 flex-1 rounded-lg border bg-card px-3 h-10">
                  <Search className="size-4 text-muted-foreground shrink-0" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Item ID e.g. DNS-8829"
                    className="border-0 shadow-none focus-visible:ring-0 font-mono p-0 h-auto"
                  />
                </div>
                <Button type="submit" className="bg-success hover:bg-success/90 text-success-foreground">
                  Lacak
                </Button>
              </div>
              {trackError && <p className="mt-2 text-xs text-destructive">{trackError}</p>}
            </form>

            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Coba ID berikut</div>
              <div className="flex flex-wrap gap-2">
                {SHIPMENTS.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => { setQuery(s.id); setActiveId(s.id); setTrackError(""); }}
                    className="font-mono text-xs px-2.5 py-1 rounded-md border hover:border-success hover:text-success transition-colors"
                  >
                    {s.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t">
              <div>
                <div className="text-xl font-bold text-success">99.8%</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Uptime</div>
              </div>
              <div>
                <div className="text-xl font-bold text-success">4.2h</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg Customs</div>
              </div>
              <div>
                <div className="text-xl font-bold text-success">2.4K</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">On-chain</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {successId && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 -mt-8 mb-8">
          <div className="rounded-xl border border-success/40 bg-success/5 p-4 flex items-center gap-3">
            <ShieldCheck className="size-5 text-success" />
            <div className="text-sm">
              Pembayaran sukses untuk <span className="font-mono font-medium">{successId}</span>. Status ditampilkan di bawah.
            </div>
          </div>
        </div>
      )}

      {/* Tracking results: split map + stepper */}
      {shipment && (
        <section id="track-result" className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Live GPS</div>
                  <div className="font-semibold flex items-center gap-2">
                    <MapPin className="size-4 text-success" />
                    {shipment.origin} → {shipment.destination}
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-xs">{shipment.truck.label}</Badge>
              </div>
              <MockMap trucks={[{
                id: shipment.id,
                plate: shipment.truck.label,
                lat: shipment.truck.lat,
                lng: shipment.truck.lng,
                status: "in-transit",
              }]} highlightId={shipment.id} />
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Item</div>
                  <div className="font-medium truncate">{shipment.itemName}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Berat</div>
                  <div className="font-medium">{shipment.quantity} kg</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Biaya</div>
                  <div className="font-medium">{formatIDR(shipment.fee)}</div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <CustomerStepper shipment={shipment} />
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="bg-slate-surface border-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-success font-medium">Bagaimana cara kerjanya</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Web2 sederhana. Web3 transparan.</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Package, title: "Form & Bayar QRIS", desc: "Buat pengiriman, bayar instan via QRIS — tanpa wallet, tanpa crypto." },
              { icon: ShieldCheck, title: "Bea Cukai Tanda Tangan", desc: "Petugas Bea Cukai memverifikasi & menandatangani kliring on-chain." },
              { icon: Truck, title: "Lacak Real-time", desc: "Lihat lokasi truk & tahapan pengiriman dari GPS hingga delivered." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl bg-card border p-6 hover:shadow-elevated transition-shadow">
                <div className="size-11 rounded-lg bg-success/10 flex items-center justify-center text-success">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Network */}
      <section id="network" className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-success font-medium">Jaringan Pelabuhan</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Hadir di pelabuhan utama Jawa.</h2>
            <p className="mt-4 text-muted-foreground">
              Dari Tanjung Priok hingga Tanjung Emas, Dan.s Logistic bermitra dengan otoritas pelabuhan dan kantor Bea Cukai.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { name: "Tanjung Priok", city: "Jakarta", vol: "8.6M TEU/yr" },
                { name: "Tanjung Perak", city: "Surabaya", vol: "3.7M TEU/yr" },
                { name: "Tanjung Emas", city: "Semarang", vol: "780K TEU/yr" },
                { name: "Belawan", city: "Medan", vol: "1.4M TEU/yr" },
              ].map((p) => (
                <div key={p.name} className="rounded-xl border p-4 bg-card">
                  <div className="flex items-center gap-2 text-success">
                    <Anchor className="size-4" />
                    <span className="text-xs uppercase tracking-wider">Active</span>
                  </div>
                  <div className="mt-2 font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.city} · {p.vol}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-navy-gradient text-navy-foreground p-8 shadow-elevated">
            <Truck className="size-10 text-success" />
            <h3 className="mt-6 text-2xl font-bold">Untuk Admin & Bea Cukai.</h3>
            <p className="mt-3 text-navy-foreground/70">
              Hubungkan Phantom wallet untuk mengakses dashboard role-specific. Admin mengelola armada. Bea Cukai menandatangani kliring.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div><div className="text-2xl font-bold text-success">2.4K</div><div className="text-xs text-navy-foreground/60">Pengiriman</div></div>
              <div><div className="text-2xl font-bold text-success">48</div><div className="text-xs text-navy-foreground/60">Operator</div></div>
              <div><div className="text-2xl font-bold text-success">99.8%</div><div className="text-xs text-navy-foreground/60">Uptime</div></div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-slate-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Truck className="size-4 text-success" />
            <span>Dan.s Logistic · Indonesia · Built on Solana</span>
          </div>
          <div className="font-mono text-xs">Smart Contract: DnsLg1...8FvP</div>
        </div>
      </footer>

      {pendingShipment && (
        <QrisModal
          open={qrisOpen}
          onOpenChange={(o) => { setQrisOpen(o); if (!o) setPendingShipment(null); }}
          fee={pendingShipment.fee}
          shipmentId={pendingShipment.id}
          onPaid={handlePaid}
        />
      )}
    </div>
  );
}
