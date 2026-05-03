import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SHIPMENTS, formatIDR } from "@/lib/mock-data";
import { Search } from "lucide-react";

export const Route = createFileRoute("/admin/shipments")({
  head: () => ({
    meta: [
      { title: "Manage Shipments — Nusantara Logistic" },
      { name: "description", content: "Kelola semua pengiriman customer di platform Nusantara Logistic." },
      { property: "og:title", content: "Manage Shipments — Nusantara Logistic" },
      { property: "og:description", content: "Kelola semua pengiriman customer di platform Nusantara Logistic." },
    ],
  }),
  component: ManageShipments,
});

function ManageShipments() {
  const [q, setQ] = useState("");
  const filtered = SHIPMENTS.filter((s) =>
    [s.id, s.itemName, s.sender, s.receiver, s.origin, s.destination]
      .some((v) => v.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold">Manage Shipments</h1>
        <p className="text-muted-foreground text-sm">Semua pengiriman yang dibuat oleh customer.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-base">All Shipments ({filtered.length})</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Cari ID, item, kota..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Pengirim → Penerima</TableHead>
                <TableHead>Rute</TableHead>
                <TableHead>Biaya</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{s.itemName}</div>
                    <div className="text-xs text-muted-foreground">{s.quantity} kg</div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>{s.sender}</div>
                    <div className="text-xs text-muted-foreground">→ {s.receiver}</div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>{s.origin}</div>
                    <div className="text-xs text-muted-foreground">→ {s.destination}</div>
                  </TableCell>
                  <TableCell className="font-medium">{formatIDR(s.fee)}</TableCell>
                  <TableCell>
                    <Badge variant="outline"
                      className={s.currentStage >= 4 ? "border-success/50 text-success" : "border-warning/50 text-warning"}>
                      {s.stages[s.currentStage]?.name ?? "Delivered"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
