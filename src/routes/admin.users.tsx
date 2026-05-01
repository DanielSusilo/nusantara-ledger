import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { USERS } from "@/lib/mock-data";
import { Search } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  component: UserManagement,
});

const ROLE_STYLES: Record<string, string> = {
  Admin: "bg-primary/10 text-primary border-primary/30",
  Supplier: "bg-warning/10 text-warning border-warning/30",
  Customs: "bg-success/10 text-success border-success/30",
};

function UserManagement() {
  const [q, setQ] = useState("");
  const filtered = USERS.filter((u) =>
    [u.name, u.email, u.role, u.pubkey].some((v) => v.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground text-sm">Off-chain registry mapping wallets to identities and roles.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Registered Wallets ({filtered.length})</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Public Key</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.email}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={ROLE_STYLES[u.role]}>{u.role}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{u.pubkey}</TableCell>
                  <TableCell className="text-muted-foreground">{u.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
