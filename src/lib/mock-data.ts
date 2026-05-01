export type StageStatus = "completed" | "current" | "pending";

export interface Stage {
  name: string;
  status: StageStatus;
  actor: string;
  location: string;
  timestamp?: string;
  txHash?: string;
}

export interface Shipment {
  id: string;
  itemName: string;
  quantity: number;
  origin: string;
  destination: string;
  currentStage: number;
  stages: Stage[];
  owner: string;
}

const STAGE_NAMES = [
  "Order Placed",
  "Raw Material Sourced",
  "Manufacturing",
  "Customs Clearance",
  "Distribution",
  "Delivered",
];

function makeStages(currentIdx: number): Stage[] {
  const actors = [
    { actor: "PT Cipta Logistik", location: "Surabaya" },
    { actor: "PT Bumi Resources", location: "Kalimantan Timur" },
    { actor: "PT Astra Manufaktur", location: "Cikarang, Bekasi" },
    { actor: "Bea Cukai Indonesia", location: "Tanjung Emas, Semarang" },
    { actor: "PT Samudera Indonesia", location: "Jakarta" },
    { actor: "Retail Partner", location: "Denpasar, Bali" },
  ];
  return STAGE_NAMES.map((name, i) => ({
    name,
    actor: actors[i].actor,
    location: actors[i].location,
    status: i < currentIdx ? "completed" : i === currentIdx ? "current" : "pending",
    timestamp: i <= currentIdx ? new Date(Date.now() - (5 - i) * 86400000).toLocaleString("id-ID") : undefined,
    txHash: i < currentIdx ? `5x${Math.random().toString(36).slice(2, 10)}…${Math.random().toString(36).slice(2, 6)}` : undefined,
  }));
}

export const SHIPMENTS: Shipment[] = [
  {
    id: "TRX-8829",
    itemName: "Coffee Beans (Arabica Gayo)",
    quantity: 1200,
    origin: "Tanjung Emas, Semarang",
    destination: "Port of Rotterdam, NL",
    currentStage: 3,
    owner: "PT Kopi Nusantara",
    stages: makeStages(3),
  },
  {
    id: "TRX-8830",
    itemName: "Palm Oil Drums",
    quantity: 540,
    origin: "Tanjung Priok, Jakarta",
    destination: "Mumbai Port, IN",
    currentStage: 2,
    owner: "PT Sawit Mandiri",
    stages: makeStages(2),
  },
  {
    id: "TRX-8831",
    itemName: "Textile Rolls (Batik)",
    quantity: 320,
    origin: "Tanjung Perak, Surabaya",
    destination: "Singapore Port",
    currentStage: 5,
    owner: "PT Batik Cipta",
    stages: makeStages(5),
  },
  {
    id: "TRX-8832",
    itemName: "Electronic Components",
    quantity: 8400,
    origin: "Tanjung Emas, Semarang",
    destination: "Yokohama Port, JP",
    currentStage: 1,
    owner: "PT Astra Elektronik",
    stages: makeStages(1),
  },
];

export const USERS = [
  { name: "Budi Santoso", role: "Admin", email: "budi@cipta-logistik.id", pubkey: "9XzK...4mNq", joined: "2024-11-02" },
  { name: "Siti Rahayu", role: "Supplier", email: "siti@kopi-nusantara.id", pubkey: "3BvR...9pLs", joined: "2024-12-15" },
  { name: "Bea Cukai Semarang", role: "Customs", email: "ops@beacukai.go.id", pubkey: "7HnW...2tXc", joined: "2024-09-21" },
  { name: "Andi Wijaya", role: "Supplier", email: "andi@sawit-mandiri.id", pubkey: "5KpM...8jZv", joined: "2025-01-10" },
  { name: "Bea Cukai Tj. Priok", role: "Customs", email: "priok@beacukai.go.id", pubkey: "2QrT...6yBn", joined: "2024-10-04" },
  { name: "Dewi Lestari", role: "Admin", email: "dewi@cipta-logistik.id", pubkey: "8FcG...1wEh", joined: "2025-02-18" },
];

export const ANALYTICS_BY_MONTH = [
  { month: "Nov", shipments: 142, completed: 128 },
  { month: "Dec", shipments: 168, completed: 151 },
  { month: "Jan", shipments: 195, completed: 178 },
  { month: "Feb", shipments: 211, completed: 192 },
  { month: "Mar", shipments: 240, completed: 221 },
  { month: "Apr", shipments: 268, completed: 244 },
];
