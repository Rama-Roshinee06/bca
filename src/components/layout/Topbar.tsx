import { Icon } from "../common/Icon"
import { Badge } from "../common/Badge"
import type { Page } from "../../types"

interface TopbarProps {
  page: Page
  title: string
  dark: boolean
  onToggleDark: () => void
  onToggleMobileNav: () => void
  onHelp: () => void
  globalSearch: string
  onGlobalSearchChange: (value: string) => void
  onGlobalSearchSubmit: (value: string) => void
}

export function Topbar({
  page,
  title,
  dark,
  onToggleDark,
  onToggleMobileNav,
  onHelp,
  globalSearch,
  onGlobalSearchChange,
  onGlobalSearchSubmit,
}: TopbarProps) {
  return (
    <header className="topbar">
      <button
        className="icon-btn menu-btn"
        onClick={onToggleMobileNav}
        aria-label="Open navigation"
      >
        <Icon name="menu" />
      </button>
      <div className="network-select">
        <span className="status-dot" />
        <div>
          <small>NETWORK</small>
          <strong>Local Test Network</strong>
        </div>
        <span className="caret">⌄</span>
      </div>
      <div className="global-search">
        <Icon name="search" size={16} />
        <input
          value={globalSearch}
          onChange={(e) =>
            onGlobalSearchChange((e.target as HTMLInputElement).value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter")
              onGlobalSearchSubmit((e.target as HTMLInputElement).value)
          }}
          placeholder="Search blocks, transactions, assets…"
        />
        <kbd>⌘ K</kbd>
      </div>
      <div className="top-actions">
        <Badge tone="good">Network operational</Badge>
        <button className="icon-btn" title="Help" onClick={onHelp}>
          <Icon name="help" />
        </button>
        <button className="icon-btn" title="Settings" onClick={() => {}}>
          <Icon name="settings" />
        </button>
        <button
          className="icon-btn"
          onClick={onToggleDark}
          aria-label="Toggle theme"
        >
          <Icon name={dark ? "sun" : "moon"} />
        </button>
      </div>
    </header>
  )
}
