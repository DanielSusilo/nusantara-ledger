import { Link, Outlet, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useWallet, shortKey, type Role } from "@/lib/wallet";
import { Button } from "@/components/ui/button";
import { Truck, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

interface DashboardShellProps {
  title: string;
  navItems: NavItem[];
  allowedRoles: Role[];
}

export function DashboardShell({ title, navItems, allowedRoles }: DashboardShellProps) {
  const { connected, role, publicKey, disconnect } = useWallet();
  const router = useRouter();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!connected || !role || !allowedRoles.includes(role)) {
      router.navigate({ to: "/" });
    }
  }, [connected, role, allowedRoles, router]);

  if (!connected || !role) return null;

  return (
    <div className="min-h-screen flex bg-slate-surface">
      <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-2 px-6 h-16 border-b border-sidebar-border">
          <div className="size-9 rounded-lg bg-success/20 flex items-center justify-center">
            <Truck className="size-5 text-sidebar-primary" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-semibold">Dan.s Logistic</div>
            <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">{title}</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = path === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-glow"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-2">
          <div className="rounded-lg bg-sidebar-accent p-3">
            <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">Wallet</div>
            <div className="font-mono text-xs">{shortKey(publicKey)}</div>
            <div className="mt-1 text-xs capitalize flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-success" /> {role}
            </div>
          </div>
          <Button
            onClick={() => { disconnect(); router.navigate({ to: "/" }); }}
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground gap-2"
          >
            <LogOut className="size-4" /> Disconnect
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="md:hidden flex items-center justify-between p-4 bg-sidebar text-sidebar-foreground">
          <div className="font-display font-semibold">Dan.s Logistic · {title}</div>
          <Button size="sm" variant="ghost" onClick={() => { disconnect(); router.navigate({ to: "/" }); }}>
            <LogOut className="size-4" />
          </Button>
        </div>
        <div className="md:hidden flex gap-1 overflow-x-auto p-2 bg-sidebar/95 text-sidebar-foreground">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to}
              className={cn("px-3 py-1.5 rounded-md text-xs whitespace-nowrap",
                path === item.to ? "bg-sidebar-primary text-sidebar-primary-foreground" : "bg-sidebar-accent")}>
              {item.label}
            </Link>
          ))}
        </div>
        <Outlet />
      </main>
    </div>
  );
}
