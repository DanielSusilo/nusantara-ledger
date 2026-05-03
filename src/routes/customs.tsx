import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import { ShieldCheck, FileCheck2 } from "lucide-react";

export const Route = createFileRoute("/customs")({
  head: () => ({
    meta: [
      { title: "Bea Cukai Console — Nusantara Logistic" },
      { name: "description", content: "Verifikasi dan tanda tangan kliring pengiriman secara on-chain di portal Bea Cukai Nusantara Logistic." },
      { property: "og:title", content: "Bea Cukai Console — Nusantara Logistic" },
      { property: "og:description", content: "Verifikasi dan tanda tangan kliring pengiriman secara on-chain di portal Bea Cukai Nusantara Logistic." },
    ],
  }),
  component: CustomsLayout,
});

function CustomsLayout() {
  return (
    <DashboardShell
      title="Bea Cukai"
      allowedRoles={["customs", "supplier"]}
      navItems={[
        { to: "/customs/verify", label: "Pending Verifications", icon: <ShieldCheck className="size-4" /> },
        { to: "/customs/cleared", label: "Cleared Goods", icon: <FileCheck2 className="size-4" /> },
      ]}
    />
  );
}
