import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import { ShieldCheck, FileCheck2 } from "lucide-react";

export const Route = createFileRoute("/customs")({
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
