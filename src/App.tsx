import { useState, useEffect } from "react"
import { Sidebar, Topbar, Breadcrumb } from "./components/layout"
import {
  Overview,
  Blocks,
  Transactions,
  CryptoLab,
  MerkleLab,
  Topology,
  Consensus,
  Provenance,
  Recovery,
  Security,
  Benchmarks,
  Docs,
} from "./pages"
import { blocks, txs, nav } from "./utils/mockData"
import type { Page } from "./types"
import "./index.css"

function App() {
  const [page, setPage] = useState<Page>("overview")
  const [dark, setDark] = useState(
    () => localStorage.getItem("verilock-theme") !== "light",
  )
  const [mobileNav, setMobileNav] = useState(false)
  const [globalSearch, setGlobalSearch] = useState("")
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null)
  const [selectedTx, setSelectedTx] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light"
    localStorage.setItem("verilock-theme", dark ? "dark" : "light")
  }, [dark])

  const go = (p: Page) => {
    setPage(p)
    setSelectedBlock(null)
    setSelectedTx(null)
    setMobileNav(false)
  }

  const refresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 650)
  }

  const openBlock = (height: number) => {
    setPage("blocks")
    setSelectedBlock(height)
  }

  const openTx = (id: string) => {
    setPage("transactions")
    setSelectedTx(id)
  }

  const reset = () => {
    localStorage.removeItem("verilock-theme")
    setDark(true)
    setPage("overview")
    setSelectedBlock(null)
    setSelectedTx(null)
  }

  const handleGlobalSearchSubmit = (value: string) => {
    if (!value) return
    const lower = value.toLowerCase()
    if (lower.includes("block")) go("blocks")
    else if (
      lower.includes("tx") ||
      lower.includes("transaction") ||
      lower.includes("asset")
    ) {
      go("transactions")
    }
  }

  const title = selectedBlock
    ? `Block ${selectedBlock}`
    : selectedTx
      ? "Transaction detail"
      : (nav.find((n) => n.id === page)?.label ?? "VERILOCK")

  return (
    <div className="app">
      <Sidebar
        page={page}
        onNavigate={go}
        mobileNav={mobileNav}
        onToggleMobileNav={() => setMobileNav(true)}
        onReset={reset}
      />
      {mobileNav && (
        <button
          className="scrim"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
        />
      )}
      <div className="shell">
        <Topbar
          page={page}
          title={title}
          dark={dark}
          onToggleDark={() => setDark(!dark)}
          onToggleMobileNav={() => setMobileNav(true)}
          onHelp={() => go("docs")}
          globalSearch={globalSearch}
          onGlobalSearchChange={setGlobalSearch}
          onGlobalSearchSubmit={handleGlobalSearchSubmit}
        />
        <Breadcrumb title={title} />
        <main className={refreshing ? "loading" : ""}>
          {page === "overview" && (
            <Overview
              openBlock={openBlock}
              openTx={openTx}
              refresh={refresh}
              viewBlocks={() => go("blocks")}
              blocks={blocks}
              txs={txs}
            />
          )}
          {page === "blocks" && (
            <Blocks
              selected={selectedBlock}
              select={setSelectedBlock}
              blocks={blocks}
            />
          )}
          {page === "transactions" && (
            <Transactions
              selected={selectedTx}
              select={setSelectedTx}
              txs={txs}
            />
          )}
          {page === "crypto" && <CryptoLab />}
          {page === "merkle" && <MerkleLab />}
          {page === "topology" && <Topology />}
          {page === "consensus" && <Consensus />}
          {page === "provenance" && <Provenance openTx={openTx} txs={txs} />}
          {page === "recovery" && <Recovery />}
          {page === "security" && <Security />}
          {page === "benchmarks" && <Benchmarks />}
          {page === "docs" && <Docs />}
        </main>
      </div>
    </div>
  )
}

export default App
