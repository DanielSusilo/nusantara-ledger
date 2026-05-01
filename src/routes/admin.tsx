import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import { Home, PackagePlus, Users, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <DashboardShell
      title="Admin Console"
      allowedRoles={["admin"]}
      navItems={[
        { to: "/admin", label: "Home", icon: <Home className="size-4" /> },
        { to: "/admin/add-item", label: "Add Item", icon: <PackagePlus className="size-4" /> },
        { to: "/admin/users", label: "User Management", icon: <Users className="size-4" /> },
        { to: "/admin/analytics", label: "Analytics", icon: <BarChart3 className="size-4" /> },
      ]}
    />
  );
}
