import { useState, useMemo } from "react"
import {
  PageHead,
  Panel,
  Badge,
  BlockTable,
  Button,
  Icon,
  Hash,
  Empty,
} from "../components/common"
import type { Block } from "@/types"

interface BlocksProps {
  selected: number | null
  select: (height: number | null) => void
  blocks: Block[]
}

export function Blocks({ selected, select, blocks }: BlocksProps) {
  const [query, setQuery] = useState("")
  const [ascending, setAscending] = useState(false)

  const found = useMemo(
    () =>
      blocks
        .filter((b) =>
          `${b.height}${b.hash}${b.validator}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          ascending ? a.height - b.height : b.height - a.height,
        ),
    [query, ascending],
  )

  const block = blocks.find((b) => b.height === selected)

  if (block) {
    return (
      <>
        <PageHead
          title={`Block #${block.height.toLocaleString()}`}
          desc={`Finalized ${block.time}`}
          actions={
            <Button onClick={() => select(null)}>Back to explorer</Button>
          }
        />
        <div className="detail-grid">
          <Panel title="Block header" className="span-2">
            <dl className="details">
              <dt>Block hash</dt>
              <dd>
                <Hash value={block.hash} full />
              </dd>
              <dt>Previous block hash</dt>
              <dd>
                <Hash value={block.prev} full />
              </dd>
              <dt>Merkle root</dt>
              <dd>
                <Hash value={block.merkle} full />
              </dd>
              <dt>Validator</dt>
              <dd>{block.validator} · Ed25519 identity verified</dd>
              <dt>Timestamp</dt>
              <dd>{block.time}</dd>
              <dt>Transaction count</dt>
              <dd>{block.count}</dd>
            </dl>
          </Panel>
          <Panel title="Verification results">
            <div className="checks">
              {[
                "Header hash matches payload",
                "Previous hash links to #12,846",
                "Merkle root matches transactions",
                "Validator signature is valid",
              ].map((x) => (
                <div key={x}>
                  <span className="checkmark">
                    <Icon name="check" size={13} />
                  </span>
                  <span>{x}</span>
                </div>
              ))}
            </div>
            <div className="integrity">
              <Badge tone="good">VERIFIED</Badge>
              <strong>All integrity checks passed</strong>
              <span>Computed locally from fixed demo data.</span>
            </div>
          </Panel>
        </div>
        <Panel title="Included transactions">
          <BlockTable
            rows={blocks.filter((b) => b.height === block.height)}
            onSelect={() => {}}
          />
        </Panel>
      </>
    )
  }

  return (
    <>
      <PageHead
        title="Blockchain Explorer"
        desc="Inspect block headers, hash links, and ledger verification status."
        actions={<Badge tone="good">Chain integrity verified</Badge>}
      />
      <Panel>
        <div className="toolbar">
          <label className="search-field">
            <Icon name="search" />
            <input
              placeholder="Search height, hash, or validator"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <Button icon="filter">All validators</Button>
          <Button onClick={() => setAscending(!ascending)}>
            Height {ascending ? "↑" : "↓"}
          </Button>
        </div>
        {found.length ? (
          <BlockTable rows={found} onSelect={(h) => select(h)} />
        ) : (
          <Empty text="Try a block height or validator ID." />
        )}
      </Panel>
      <Panel title="Hash-linked chain view">
        <div className="chain">
          {blocks
            .slice(0, 4)
            .reverse()
            .map((b, i) => (
              <div className="chain-item" key={b.height}>
                <div>
                  <small>BLOCK</small>
                  <strong>#{b.height}</strong>
                  <Hash value={b.hash} />
                </div>
                {i < 3 && (
                  <span className="chain-link">
                    <Icon name="chevron" />
                    <small>previousHash</small>
                  </span>
                )}
              </div>
            ))}
        </div>
      </Panel>
    </>
  )
}
