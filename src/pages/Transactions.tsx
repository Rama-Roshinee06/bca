import { useState, useMemo } from "react"
import {
  PageHead,
  Panel,
  Badge,
  TxTable,
  Button,
  Icon,
  Hash,
  Empty,
} from "../components/common"
import { seedHash } from "@/utils/hashing"
import type { Transaction } from "@/types"

interface TransactionsProps {
  selected: string | null
  select: (id: string | null) => void
  txs: Transaction[]
}

export function Transactions({ selected, select, txs }: TransactionsProps) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All statuses")
  const [type, setType] = useState("All transaction types")
  const [latestFirst, setLatestFirst] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newTxs, setNewTxs] = useState<Transaction[]>([])
  const [form, setForm] = useState({
    asset: "",
    from: "",
    to: "",
    nonce: "",
    metadata: "",
  })
  const [error, setError] = useState("")

  const transaction = [...newTxs, ...txs].find((t) => t.id === selected)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.asset || !form.from || !form.to || !form.nonce) {
      return setError("Asset, sender, recipient, and nonce are required.")
    }
    if (form.from === form.to) {
      return setError("Sender and recipient must be different.")
    }
    if (
      [...txs, ...newTxs].some(
        (t) => t.asset === form.asset && t.status === "Pending",
      )
    ) {
      return setError(
        "Conflicting transfer blocked: this asset already has a pending transfer.",
      )
    }
    const item: Transaction = {
      id: `tx_${seedHash(form.asset + form.nonce)}`,
      asset: form.asset,
      from: form.from,
      to: form.to,
      sig: "Verified",
      block: null,
      time: new Date().toLocaleTimeString("en-US", { hour12: false }),
      status: "Pending",
      type: "Custody transfer",
    }
    setNewTxs([item, ...newTxs])
    setError("")
    setShowForm(false)
    setForm({ asset: "", from: "", to: "", nonce: "", metadata: "" })
  }

  if (transaction) {
    return (
      <>
        <PageHead
          title="Transaction detail"
          desc="Signed state transition and ledger inclusion evidence."
          actions={
            <Button onClick={() => select(null)}>Back to transactions</Button>
          }
        />
        <div className="detail-grid">
          <Panel title="Transaction envelope" className="span-2">
            <dl className="details">
              <dt>Transaction ID</dt>
              <dd>
                <Hash value={transaction.id} full />
              </dd>
              <dt>Asset ID</dt>
              <dd>{transaction.asset}</dd>
              <dt>Operation</dt>
              <dd>{transaction.type}</dd>
              <dt>Sender</dt>
              <dd>{transaction.from}</dd>
              <dt>Recipient</dt>
              <dd>{transaction.to}</dd>
              <dt>Timestamp</dt>
              <dd>2025-06-18 {transaction.time} UTC</dd>
            </dl>
          </Panel>
          <Panel title="Validation">
            <div className="checks">
              {[
                "Schema accepted",
                "Nonce not previously used",
                "Digital signature verified",
                transaction.block
                  ? `Included in block #${transaction.block}`
                  : "Awaiting block inclusion",
              ].map((x, i) => (
                <div key={x}>
                  <span
                    className={
                      i === 3 && !transaction.block ? "warnmark" : "checkmark"
                    }
                  >
                    <Icon
                      name={i === 3 && !transaction.block ? "alert" : "check"}
                      size={13}
                    />
                  </span>
                  <span>{x}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
        <Panel title="Ledger proof">
          <div className="proof-line">
            <Badge tone={transaction.block ? "good" : "warn"}>
              {transaction.block ? "INCLUDED" : "PENDING"}
            </Badge>
            <span>
              {transaction.block
                ? "Merkle branch verifies against the committed block root."
                : "Proof becomes available after consensus finalizes this transaction."}
            </span>
          </div>
        </Panel>
      </>
    )
  }

  const all = useMemo(
    () =>
      [...newTxs, ...txs]
        .filter((t) =>
          `${t.id}${t.asset}${t.from}${t.to}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .filter((t) => status === "All statuses" || t.status === status)
        .filter((t) => type === "All transaction types" || t.type === type)
        .sort((a, b) =>
          latestFirst
            ? b.time.localeCompare(a.time)
            : a.time.localeCompare(b.time),
        ),
    [newTxs, query, status, type, latestFirst],
  )

  return (
    <>
      <PageHead
        title="Transactions"
        desc="Search, inspect, and submit signed asset state transitions."
        actions={
          <Button kind="primary" icon="plus" onClick={() => setShowForm(true)}>
            Create transaction
          </Button>
        }
      />
      <Panel>
        <div className="toolbar">
          <label className="search-field">
            <Icon name="search" />
            <input
              placeholder="Search transaction, asset, or organization"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select
            aria-label="Status filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>All statuses</option>
            <option>Committed</option>
            <option>Pending</option>
          </select>
          <select
            aria-label="Type filter"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>All transaction types</option>
            <option>Custody transfer</option>
            <option>Inspection</option>
            <option>Registration</option>
            <option>Ownership transfer</option>
            <option>Final delivery</option>
          </select>
          <Button onClick={() => setLatestFirst(!latestFirst)}>
            Time {latestFirst ? "↓" : "↑"}
          </Button>
        </div>
        {all.length ? (
          <TxTable rows={all} onSelect={(id) => select(id)} />
        ) : (
          <Empty text="Check the filters, transaction ID, or asset identifier." />
        )}
      </Panel>
      {showForm && (
        <div className="modal-backdrop" onMouseDown={() => setShowForm(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <h2 id="create-title">Create transaction</h2>
                <p>Submit a state transition to the local demo queue.</p>
              </div>
              <button className="icon-btn" onClick={() => setShowForm(false)}>
                <Icon name="x" />
              </button>
            </div>
            <form onSubmit={submit}>
              <label>
                Asset identifier
                <input
                  value={form.asset}
                  onChange={(e) => setForm({ ...form, asset: e.target.value })}
                  placeholder="AST-0000-XX"
                />
              </label>
              <div className="form-grid">
                <label>
                  Sender
                  <input
                    value={form.from}
                    onChange={(e) => setForm({ ...form, from: e.target.value })}
                    placeholder="Organization name"
                  />
                </label>
                <label>
                  Recipient
                  <input
                    value={form.to}
                    onChange={(e) => setForm({ ...form, to: e.target.value })}
                    placeholder="Organization name"
                  />
                </label>
              </div>
              <label>
                Unique nonce
                <input
                  value={form.nonce}
                  onChange={(e) => setForm({ ...form, nonce: e.target.value })}
                  placeholder="e.g. 10482"
                />
              </label>
              <label>
                Metadata
                <textarea
                  value={form.metadata}
                  onChange={(e) =>
                    setForm({ ...form, metadata: e.target.value })
                  }
                  placeholder="Optional transfer context"
                />
              </label>
              {error && (
                <div className="form-error">
                  <Icon name="alert" />
                  {error}
                </div>
              )}
              <div className="modal-actions">
                <Button onClick={() => setShowForm(false)}>Cancel</Button>
                <Button kind="primary" type="submit">
                  Validate & submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
