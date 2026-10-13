import {
  PageHead,
  Panel,
  Badge,
  Notice,
  Hash,
  Icon,
} from "../components/common"
import type { Transaction } from "@/types"

interface ProvenanceProps {
  openTx: (id: string) => void
  txs: Transaction[]
}

export function Provenance({ openTx, txs }: ProvenanceProps) {
  const events = [
    ["Asset registration", "Origin Registry", "2025-06-16 08:14 UTC", txs[2]],
    [
      "Custody transfer",
      "Northstar Manufacturing",
      "2025-06-16 13:42 UTC",
      txs[0],
    ],
    ["Quality inspection", "Meridian QA", "2025-06-17 09:20 UTC", txs[1]],
    ["Ownership transfer", "Pioneer Retail", "2025-06-17 16:08 UTC", txs[3]],
    ["Final delivery", "Nexus Freight", "2025-06-18 10:41 UTC", txs[4]],
  ] as const

  return (
    <>
      <PageHead
        title="Asset Provenance"
        desc="Trace the recorded lifecycle of a supply-chain asset."
        actions={
          <div className="asset-select">
            <small>ACTIVE ASSET</small>
            <strong>AST-2849-QA</strong>
          </div>
        }
      />
      <Notice
        icon="alert"
        title="Integrity is not truth attestation"
        description="These checks show that recorded history has not changed according to this demo's ledger verification. They do not prove that real-world events were truthful."
      />
      <div className="provenance-layout">
        <Panel title="Asset record">
          <div className="asset-card">
            <div className="asset-code">A2</div>
            <div>
              <small>INDUSTRIAL CONTROLLER</small>
              <strong>AST-2849-QA</strong>
              <span>Batch BT-2025-0616 · Active</span>
            </div>
          </div>
          <dl className="mini-details">
            <dt>Manufacturer</dt>
            <dd>Northstar Manufacturing</dd>
            <dt>Registered</dt>
            <dd>June 16, 2025</dd>
            <dt>Current custodian</dt>
            <dd>Aurora Labs</dd>
            <dt>Ledger events</dt>
            <dd>5 verified</dd>
          </dl>
        </Panel>
        <Panel title="Recorded history" className="span-2">
          <div className="provenance-line">
            {events.map(([name, org, time, tx], i) => (
              <div className="provenance-event" key={name}>
                <span className="event-index">{i + 1}</span>
                <div>
                  <div className="event-title">
                    <strong>{name}</strong>
                    <Badge tone="good">VERIFIED</Badge>
                  </div>
                  <span>
                    {org} · {time}
                  </span>
                  <button onClick={() => openTx(tx.id)}>
                    <Hash value={tx.id} />
                    <span>Open proof</span>
                    <Icon name="chevron" size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  )
}
