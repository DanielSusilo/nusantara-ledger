import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "admin" | "supplier" | "customs";

interface WalletState {
  connected: boolean;
  publicKey: string | null;
  role: Role | null;
  connect: (role: Role) => void;
  disconnect: () => void;
}

function mockPubkey() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789abcdefghijkmnopqrstuvwxyz";
  let out = "";
  for (let i = 0; i < 44; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export const useWallet = create<WalletState>()(
  persist(
    (set) => ({
      connected: false,
      publicKey: null,
      role: null,
      connect: (role) => set({ connected: true, publicKey: mockPubkey(), role }),
      disconnect: () => set({ connected: false, publicKey: null, role: null }),
    }),
    { name: "mock-wallet" },
  ),
);

export function shortKey(k: string | null) {
  if (!k) return "";
  return `${k.slice(0, 4)}…${k.slice(-4)}`;
}
