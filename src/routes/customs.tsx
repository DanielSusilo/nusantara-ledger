import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import { Home, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/customs")({
  component: CustomsLayout,
});

function CustomsLayout() {
  return (
    <DashboardShell
      title="Customs / Stakeholder"
      allowedRoles={["customs", "supplier"]}
      navItems={[
        { to: "/customs", label: "Home", icon: <Home className="size-4" /> },
        { to: "/customs/verify", label: "Verify Goods", icon: <ShieldCheck className="size-4" /> },
      ]}
    />
  );
}
