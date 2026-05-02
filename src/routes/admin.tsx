import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import { Home, Package, Map } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <DashboardShell
      title="Admin Console"
      allowedRoles={["admin"]}
      navItems={[
        { to: "/admin", label: "Dashboard", icon: <Home className="size-4" /> },
        { to: "/admin/shipments", label: "Manage Shipments", icon: <Package className="size-4" /> },
        { to: "/admin/fleet", label: "Fleet Map Tracking", icon: <Map className="size-4" /> },
      ]}
    />
  );
}
