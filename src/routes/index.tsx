import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ShieldCheck, Anchor, Network, Zap, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PublicNav } from "@/components/PublicNav";
import { ShipmentTimeline } from "@/components/ShipmentTimeline";
import { SHIPMENTS } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LogiChain — Algorithmic Trust for Indonesian Port Logistics" },
      { name: "description", content: "Web3-powered supply chain tracking and verification for Indonesian ports. Track goods on-chain across Tanjung Emas, Tanjung Priok, and beyond." },
      { property: "og:title", content: "LogiChain — Algorithmic Trust for Indonesian Port Logistics" },
      { property: "og:description", content: "Track and verify shipments on-chain across Indonesia's busiest ports." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleTrack = (e?: React.FormEvent) => {
    e?.preventDefault();
    const id = query.trim().toUpperCase();
    if (!id) return;
    const found = SHIPMENTS.find((s) => s.id === id);
    if (found) {
      setActiveId(found.id);
      setError("");
      setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth" }), 50);
    } else {
      setError(`No shipment found for "${id}". Try TRX-8829, TRX-8830, TRX-8831, TRX-8832.`);
      setActiveId(null);
    }
  };

  const shipment = SHIPMENTS.find((s) => s.id === activeId);

  return (
    <div className="min-h-screen">
      <PublicNav />

      {/* Hero */}
      <section id="track" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="max-w-3xl">
            <Badge className="bg-success/15 text-success hover:bg-success/15 border border-success/30 rounded-full px-3 py-1">
              <span className="size-1.5 rounded-full bg-success mr-2 animate-pulse" />
              Solana · Live Devnet · 2,418 shipments tracked
            </Badge>
            <h1 className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight">
              Algorithmic Trust <br />
              <span className="text-gradient-emerald">in Logistics.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              On-chain verification for goods moving through Indonesia's ports. From Tanjung Emas to Tanjung Priok — every handoff is signed, immutable, and auditable.
            </p>

            <form onSubmit={handleTrack} className="mt-10 max-w-2xl">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Track a shipment</div>
              <div className="flex flex-col sm:flex-row gap-2 rounded-2xl bg-card border p-2 shadow-elevated">
                <div className="flex items-center gap-3 flex-1 px-3">
                  <Search className="size-5 text-muted-foreground shrink-0" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter Item ID e.g. TRX-8829"
                    className="border-0 shadow-none focus-visible:ring-0 text-base font-mono"
                  />
                </div>
                <Button type="submit" size="lg" className="bg-success hover:bg-success/90 text-success-foreground rounded-xl">
                  Track Shipment
                </Button>
              </div>
              {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>Try:</span>
                {SHIPMENTS.map((s) => (
                  <button key={s.id} type="button" onClick={() => { setQuery(s.id); }}
                    className="font-mono hover:text-success transition-colors">
                    {s.id}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Result */}
      {shipment && (
        <section id="result" className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
          <ShipmentTimeline shipment={shipment} />
        </section>
      )}

      {/* How it works */}
      <section id="how" className="bg-slate-surface border-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-success font-medium">How it works</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Built for ports. Powered by signatures.</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Anchor, title: "Origin Manifest", desc: "Suppliers register goods at the port. Each item gets a unique on-chain identity." },
              { icon: ShieldCheck, title: "Customs Verify & Sign", desc: "Bea Cukai officers sign clearances directly with their wallet — no paperwork." },
              { icon: Network, title: "End-to-end Provenance", desc: "Buyers, regulators, and partners track every handoff from raw material to retail." },
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
            <div className="text-xs uppercase tracking-widest text-success font-medium">Indonesian Port Network</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Live across 4 major ports.</h2>
            <p className="mt-4 text-muted-foreground">
              From Java's busiest container terminals to deep-water gateways, LogiChain partners with port authorities and customs offices nationwide.
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
            <Globe2 className="size-10 text-success" />
            <h3 className="mt-6 text-2xl font-bold">For operators, customs &amp; suppliers.</h3>
            <p className="mt-3 text-navy-foreground/70">
              Connect your wallet to access role-specific dashboards. Operators register shipments. Customs sign verifications. Suppliers monitor goods.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div><div className="text-2xl font-bold text-success">2.4K</div><div className="text-xs text-navy-foreground/60">Shipments</div></div>
              <div><div className="text-2xl font-bold text-success">48</div><div className="text-xs text-navy-foreground/60">Operators</div></div>
              <div><div className="text-2xl font-bold text-success">99.8%</div><div className="text-xs text-navy-foreground/60">Uptime</div></div>
            </div>
            <div className="mt-8 flex gap-3">
              <Button asChild className="bg-success hover:bg-success/90 text-success-foreground">
                <Link to="/">Connect to start</Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent border-navy-foreground/30 text-navy-foreground hover:bg-navy-foreground/10">
                <a href="#how">Learn more</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-slate-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-success" />
            <span>LogiChain Indonesia · Built on Solana</span>
          </div>
          <div className="font-mono text-xs">Smart Contract: LogiX1...8FvP</div>
        </div>
      </footer>
    </div>
  );
}
