import { useState } from "react"
import { Icon } from "../common/Icon"
import { Button } from "../common/Button"
import { Badge } from "../common/Badge"
import type { NavItem, Page } from "../../types"

interface SidebarProps {
  page: Page
  onNavigate: (page: Page) => void
  mobileNav: boolean
  onToggleMobileNav: () => void
  dark: boolean
  onToggleDark: () => void
  onReset: () => void
}

export function Sidebar({
  page,
  onNavigate,
  mobileNav,
  onToggleMobileNav,
  dark,
  onToggleDark,
  onReset,
}: SidebarProps) {
  const nav = [
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
  ] as NavItem[]

  return (
    <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
      <div className="brand">
        <div className="brandmark">
          <span />
          <span />
          <span />
        </div>
        <div>
          <strong>VERILOCK</strong>
          <small>LEDGER SECURITY LAB</small>
        </div>
        <button
          className="mobile-close"
          onClick={onToggleMobileNav}
          aria-label="Close navigation"
        >
          <Icon name="x" />
        </button>
      </div>
      <nav aria-label="Primary navigation">
        {nav.map((item) => (
          <div key={item.id}>
            {item.group && <div className="nav-separator" />}
            <button
              className={page === item.id ? "active" : ""}
              onClick={() => onNavigate(item.id)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          </div>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="sim-label">
          <Icon name="alert" size={15} />
          <div>
            <strong>Educational simulation</strong>
            <span>Local browser model · v1.4</span>
          </div>
        </div>
        <Button kind="ghost" icon="refresh" onClick={onReset}>
          Reset demo state
        </Button>
      </div>
    </aside>
  )
}
