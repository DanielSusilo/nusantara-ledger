import { Link } from "@tanstack/react-router";
import { ConnectWalletButton } from "./ConnectWallet";
import { Truck } from "lucide-react";

export function PublicNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-navy-gradient flex items-center justify-center shadow-elevated">
            <Truck className="size-5 text-success" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-semibold">Dan.s Logistic</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Indonesia · On-chain</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#create" className="hover:text-foreground transition-colors">Kirim Barang</a>
          <a href="#track" className="hover:text-foreground transition-colors">Lacak</a>
          <a href="#network" className="hover:text-foreground transition-colors">Jaringan</a>
        </nav>

        <ConnectWalletButton />
      </div>
    </header>
  );
}
