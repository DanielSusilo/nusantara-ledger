export type StageStatus = "completed" | "current" | "pending";

export interface Stage {
  name: string;
  status: StageStatus;
  actor: string;
  location: string;
  timestamp?: string;
  txHash?: string;
}

// Customer-facing 5-stage flow
export const CUSTOMER_STAGES = [
  "Ordered",
  "Paid (QRIS)",
  "Bea Cukai Clearance",
  "In Transit",
  "Delivered",
] as const;

export interface Shipment {
  id: string;
  itemName: string;
  quantity: number; // weight in kg for customer-created
  origin: string;
  destination: string;
  sender: string;
  receiver: string;
  fee: number; // IDR
  currentStage: number; // 0..4
  stages: Stage[];
  createdAt: string;
  // mock truck position
  truck: { lat: number; lng: number; label: string };
}

const ACTORS = [
  { actor: "Dan.s Logistic", location: "Origin Hub" },
  { actor: "QRIS Gateway", location: "BI-FAST" },
  { actor: "Bea Cukai", location: "Port Customs" },
  { actor: "Fleet Driver", location: "On Route" },
  { actor: "Receiver", location: "Final Destination" },
];

function makeStages(currentIdx: number, originCity: string, customsPort: string, destCity: string): Stage[] {
  const overrides = [
    { actor: "Dan.s Logistic", location: originCity },
    { actor: "QRIS · BI-FAST", location: "Online Payment" },
    { actor: "Bea Cukai", location: customsPort },
    { actor: "Fleet Driver", location: "Trans-Java Route" },
    { actor: "Receiver", location: destCity },
  ];
  return CUSTOMER_STAGES.map((name, i) => ({
    name,
    actor: overrides[i]?.actor ?? ACTORS[i].actor,
    location: overrides[i]?.location ?? ACTORS[i].location,
    status: i < currentIdx ? "completed" : i === currentIdx ? "current" : "pending",
    timestamp:
      i <= currentIdx
        ? new Date(Date.now() - (4 - i) * 86400000).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })
        : undefined,
    txHash:
      i < currentIdx
        ? `5x${Math.random().toString(36).slice(2, 10)}…${Math.random().toString(36).slice(2, 6)}`
        : undefined,
  }));
}

export const SHIPMENTS: Shipment[] = [
  {
    id: "DNS-8829",
    itemName: "Kopi Arabica Gayo (5 box)",
    quantity: 28,
    origin: "Semarang, Jawa Tengah",
    destination: "Surakarta, Jawa Tengah",
    sender: "Budi Santoso",
    receiver: "CV Kopi Solo",
    fee: 250000,
    currentStage: 3,
    createdAt: "2026-04-28",
    truck: { lat: -7.35, lng: 110.5, label: "B 9214 KLM" },
    stages: makeStages(3, "Semarang", "Tanjung Emas, Semarang", "Surakarta"),
  },
  {
    id: "DNS-8830",
    itemName: "Suku Cadang Mesin",
    quantity: 142,
    origin: "Jakarta",
    destination: "Semarang, Jawa Tengah",
    sender: "PT Astra Parts",
    receiver: "Bengkel Jaya Motor",
    fee: 480000,
    currentStage: 2,
    createdAt: "2026-04-30",
    truck: { lat: -6.7, lng: 108.55, label: "B 8821 PRJ" },
    stages: makeStages(2, "Jakarta", "Tanjung Priok, Jakarta", "Semarang"),
  },
  {
    id: "DNS-8831",
    itemName: "Tekstil Batik (10 roll)",
    quantity: 64,
    origin: "Surabaya, Jawa Timur",
    destination: "Yogyakarta",
    sender: "PT Batik Cipta",
    receiver: "Toko Malioboro",
    fee: 320000,
    currentStage: 4,
    createdAt: "2026-04-25",
    truck: { lat: -7.79, lng: 110.36, label: "L 1024 BTK" },
    stages: makeStages(4, "Surabaya", "Tanjung Perak, Surabaya", "Yogyakarta"),
  },
  {
    id: "DNS-8832",
    itemName: "Komponen Elektronik",
    quantity: 18,
    origin: "Semarang, Jawa Tengah",
    destination: "Magelang, Jawa Tengah",
    sender: "PT Astra Elektronik",
    receiver: "Service Center Magelang",
    fee: 175000,
    currentStage: 1,
    createdAt: "2026-05-01",
    truck: { lat: -7.0, lng: 110.42, label: "H 4421 ELK" },
    stages: makeStages(1, "Semarang", "Tanjung Emas, Semarang", "Magelang"),
  },
  {
    id: "DNS-8833",
    itemName: "Hasil Laut Beku",
    quantity: 320,
    origin: "Pekalongan, Jawa Tengah",
    destination: "Cilacap, Jawa Tengah",
    sender: "UD Samudera Jaya",
    receiver: "Pasar Ikan Cilacap",
    fee: 540000,
    currentStage: 2,
    createdAt: "2026-04-29",
    truck: { lat: -7.42, lng: 109.22, label: "G 7712 LSR" },
    stages: makeStages(2, "Pekalongan", "Tanjung Emas, Semarang", "Cilacap"),
  },
];

// Truck fleet for the live map
export const FLEET = SHIPMENTS.map((s) => ({
  id: s.id,
  plate: s.truck.label,
  driver: ["Pak Joko", "Pak Slamet", "Pak Wahyu", "Pak Bambang", "Pak Hadi"][Math.floor(Math.random() * 5)],
  lat: s.truck.lat,
  lng: s.truck.lng,
  origin: s.origin,
  destination: s.destination,
  status: s.currentStage >= 4 ? "delivered" : s.currentStage >= 3 ? "in-transit" : "at-customs",
  speedKmh: 38 + Math.floor(Math.random() * 30),
}));

export const USERS = [
  { name: "Budi Santoso", role: "Admin", email: "budi@dans-logistic.id", pubkey: "9XzK...4mNq", joined: "2024-11-02" },
  { name: "Siti Rahayu", role: "Customer", email: "siti@kopi-nusantara.id", pubkey: "—", joined: "2024-12-15" },
  { name: "Bea Cukai Semarang", role: "Customs", email: "ops@beacukai.go.id", pubkey: "7HnW...2tXc", joined: "2024-09-21" },
  { name: "Andi Wijaya", role: "Customer", email: "andi@sawit-mandiri.id", pubkey: "—", joined: "2025-01-10" },
  { name: "Bea Cukai Tj. Priok", role: "Customs", email: "priok@beacukai.go.id", pubkey: "2QrT...6yBn", joined: "2024-10-04" },
  { name: "Dewi Lestari", role: "Admin", email: "dewi@dans-logistic.id", pubkey: "8FcG...1wEh", joined: "2025-02-18" },
];

export const ANALYTICS_BY_MONTH = [
  { month: "Nov", shipments: 142, completed: 128 },
  { month: "Dec", shipments: 168, completed: 151 },
  { month: "Jan", shipments: 195, completed: 178 },
  { month: "Feb", shipments: 211, completed: 192 },
  { month: "Mar", shipments: 240, completed: 221 },
  { month: "Apr", shipments: 268, completed: 244 },
];

export function formatIDR(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}
