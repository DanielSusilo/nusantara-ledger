import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SHIPMENTS } from "@/lib/mock-data";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/customs/cleared")({
  component: ClearedGoods,
});

function ClearedGoods() {
  // Items past customs (stage > 2)
  const cleared = SHIPMENTS.filter((s) => s.currentStage > 2);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold">Cleared Goods</h1>
        <p className="text-muted-foreground text-sm">Pengiriman yang telah melewati Bea Cukai dan tercatat on-chain.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="size-4 text-success" />
            Cleared this period ({cleared.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item ID</TableHead>
                <TableHead>Goods</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Cleared On</TableHead>
                <TableHead>Tx Hash</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cleared.map((s) => {
                const customsStage = s.stages[2];
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{s.itemName}</div>
                      <div className="text-xs text-muted-foreground">{s.quantity} kg</div>
                    </TableCell>
                    <TableCell className="text-sm">{s.origin}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{customsStage?.timestamp ?? "—"}</TableCell>
                    <TableCell className="font-mono text-xs text-success">{customsStage?.txHash ?? "—"}</TableCell>
                    <TableCell>
                      <Badge className="bg-success text-success-foreground hover:bg-success">Cleared</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
