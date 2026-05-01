import { Link } from "@tanstack/react-router";
import { ConnectWalletButton } from "./ConnectWallet";
import { Boxes } from "lucide-react";

export function PublicNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-lg bg-navy-gradient flex items-center justify-center shadow-elevated">
            <Boxes className="size-5 text-success" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-semibold">LogiChain</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Indonesia Ports</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#track" className="hover:text-foreground transition-colors">Track</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#network" className="hover:text-foreground transition-colors">Network</a>
        </nav>

        <ConnectWalletButton />
      </div>
    </header>
  );
}
