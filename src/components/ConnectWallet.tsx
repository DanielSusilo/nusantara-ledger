import { useState } from "react";
import { Wallet, Check, Loader2, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet, type Role, shortKey } from "@/lib/wallet";
import { useNavigate } from "@tanstack/react-router";

const ROLE_ROUTES: Record<Role, string> = {
  admin: "/admin",
  supplier: "/customs/verify",
  customs: "/customs/verify",
};

export function ConnectWalletButton() {
  const { connected, publicKey, role, connect, disconnect } = useWallet();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  const [signing, setSigning] = useState(false);

  const handleConnect = async () => {
    setSigning(true);
    await new Promise((r) => setTimeout(r, 1400));
    connect(selectedRole);
    setSigning(false);
    setOpen(false);
    navigate({ to: ROLE_ROUTES[selectedRole] });
  };

  if (connected && publicKey && role) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 border-success/40 bg-success/5">
            <span className="size-2 rounded-full bg-success animate-pulse" />
            <span className="font-mono text-xs">{shortKey(publicKey)}</span>
            <ChevronDown className="size-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="text-xs text-muted-foreground">Connected as</div>
            <div className="font-medium capitalize">{role}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate({ to: ROLE_ROUTES[role] })}>
            Go to Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate({ to: "/" })}>Tracking</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { disconnect(); navigate({ to: "/" }); }} className="text-destructive">
            <LogOut className="size-4" /> Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-success text-success-foreground hover:bg-success/90 gap-2">
        <Wallet className="size-4" /> Connect Wallet
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="size-9 rounded-lg bg-[#AB9FF2]/20 flex items-center justify-center">
                <span className="text-lg">👻</span>
              </div>
              Connect Phantom Wallet
            </DialogTitle>
            <DialogDescription>
              Authenticate via Solana wallet. Your role determines on-chain permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select role (testing)</label>
              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin · Logistics Operator</SelectItem>
                  <SelectItem value="customs">Bea Cukai (Customs Officer)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between"><span>Network</span><span className="font-mono">Solana Devnet</span></div>
              <div className="flex justify-between"><span>Smart Contract</span><span className="font-mono">LogiX...8FvP</span></div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={signing}>Cancel</Button>
            <Button onClick={handleConnect} disabled={signing} className="bg-success hover:bg-success/90 text-success-foreground gap-2">
              {signing ? (<><Loader2 className="size-4 animate-spin" /> Signing...</>) : (<><Check className="size-4" /> Approve & Connect</>)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
