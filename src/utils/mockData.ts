import { seedHash } from "./hashing"
import type { Transaction, Block, NavItem } from "../types"

export const txs: Transaction[] = [
  {
    id: `tx_${seedHash("custody")}`,
    asset: "AST-2849-QA",
    from: "Northstar Mfg",
    to: "Atlas Logistics",
    sig: "Verified",
    block: 12847,
    time: "10:42:16",
    status: "Committed",
    type: "Custody transfer",
  },
  {
    id: `tx_${seedHash("sensor")}`,
    asset: "AST-7712-TX",
    from: "Vector Sensors",
    to: "Meridian QA",
    sig: "Verified",
    block: 12847,
    time: "10:42:11",
    status: "Committed",
    type: "Inspection",
  },
  {
    id: `tx_${seedHash("register")}`,
    asset: "AST-9304-NY",
    from: "Origin Registry",
    to: "Helix Components",
    sig: "Verified",
    block: 12846,
    time: "10:41:49",
    status: "Committed",
    type: "Registration",
  },
  {
    id: `tx_${seedHash("transfer")}`,
    asset: "AST-1198-CA",
    from: "Quarry Systems",
    to: "Pioneer Retail",
    sig: "Verified",
    block: 12846,
    time: "10:41:44",
    status: "Committed",
    type: "Ownership transfer",
  },
  {
    id: `tx_${seedHash("delivery")}`,
    asset: "AST-5501-WA",
    from: "Nexus Freight",
    to: "Aurora Labs",
    sig: "Verified",
    block: 12845,
    time: "10:41:20",
    status: "Committed",
    type: "Final delivery",
  },
  {
    id: `tx_${seedHash("pending")}`,
    asset: "AST-4207-MI",
    from: "Forge Industrial",
    to: "Atlas Logistics",
    sig: "Verified",
    block: null,
    time: "10:43:02",
    status: "Pending",
    type: "Custody transfer",
  },
]

export const blocks: Block[] = Array.from({ length: 8 }, (_, i) => {
  const height = 12847 - i
  return {
    height,
    hash: seedHash(`block-${height}`),
    prev: seedHash(`block-${height - 1}`),
    merkle: seedHash(`merkle-${height}`),
    count: [2, 2, 4, 3, 1, 5, 3, 2][i],
    time: `2025-06-18 10:${String(42 - i).padStart(2, "0")}:${String(
      18 - i * 2,
    ).padStart(2, "0")} UTC`,
    validator: `VAL-0${(i % 4) + 1}`,
    status: "Verified",
  }
})

export const nav: NavItem[] = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "blocks", label: "Blockchain Explorer", icon: "blocks" },
  { id: "transactions", label: "Transactions", icon: "swap" },
  {
    id: "crypto",
    label: "Cryptographic Verification",
    icon: "shield",
    group: true,
  },
  { id: "merkle", label: "Merkle Proofs", icon: "tree" },
  { id: "topology", label: "Network Topology", icon: "network" },
  { id: "consensus", label: "Validators & Consensus", icon: "nodes" },
  { id: "provenance", label: "Asset Provenance", icon: "route", group: true },
  { id: "recovery", label: "Replication & Recovery", icon: "refresh" },
  { id: "security", label: "Security Lab", icon: "lock" },
  { id: "benchmarks", label: "Performance Benchmarks", icon: "chart" },
  { id: "docs", label: "Documentation", icon: "book", group: true },
]
