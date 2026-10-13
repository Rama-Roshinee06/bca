import { useState } from "react"
import { PageHead, Panel, Icon } from "../components/common"

const sections = [
  "System architecture",
  "Transaction lifecycle",
  "Block structure",
  "Hash chaining",
  "Digital signatures",
  "Merkle trees",
  "Permissioned consensus",
  "Replica synchronization",
  "Fault tolerance",
  "Threat model",
  "Known limitations",
]

function Architecture() {
  return (
    <div className="architecture">
      <div>
        <Icon name="swap" />
        <strong>Clients</strong>
        <span>Signed transactions</span>
      </div>
      <b>→</b>
      <div>
        <Icon name="shield" />
        <strong>Validation</strong>
        <span>Schema · signature · nonce</span>
      </div>
      <b>→</b>
      <div>
        <Icon name="blocks" />
        <strong>Block builder</strong>
        <span>Merkle root · hash link</span>
      </div>
      <b>→</b>
      <div className="accent">
        <Icon name="nodes" />
        <strong>4 replicas</strong>
        <span>PBFT-style simulation</span>
      </div>
      <b>→</b>
      <div>
        <Icon name="book" />
        <strong>Ledger</strong>
        <span>Replicated storage</span>
      </div>
    </div>
  )
}

function DocSection({ name }: { name: string }) {
  const copy: Record<string, [string, string, string]> = {
    "Transaction lifecycle": [
      "A transaction moves from client construction through validation, pending selection, consensus, and final inclusion.",
      "Validation rules",
      "The model checks required fields, distinct sender and recipient, asset conflicts, nonce reuse, and signature fixture status.",
    ],
    "Block structure": [
      "Each block header contains height, timestamp, previous hash, Merkle root, validator identity, and transaction count.",
      "Canonical encoding",
      "A production system must define byte-level canonicalization. This educational model uses deterministic UTF-8 JSON strings.",
    ],
    "Hash chaining": [
      "Every block references the digest of its predecessor. Modifying historical data changes its digest and breaks the next block's stored reference.",
      "Integrity scope",
      "Hash chains reveal modification; they do not prevent an authorized party from recording false input.",
    ],
    "Digital signatures": [
      "Signatures bind a transaction payload to a key holder. VERILOCK labels fixture signatures and does not claim live identity verification.",
      "Production integration",
      "A backend should manage public-key enrollment, revocation, canonical payloads, and hardware-backed signing.",
    ],
    "Merkle trees": [
      "Transactions are hashed in a binary tree; the root commits to the full set. Inclusion proofs require only log₂(n) sibling hashes.",
      "Verification",
      "Any party with the Merkle root can verify a transaction's inclusion without the full block.",
    ],
    "Permissioned consensus": [
      "A PBFT-style protocol runs among four known validators. Safety requires 3f+1 replicas to tolerate f Byzantine faults.",
      "Simplifications",
      "View changes, checkpointing, and persistent log replication are not modeled.",
    ],
    "Replica synchronization": [
      "A lagging replica fetches missing blocks, verifies each prevHash link, and replays transactions to reconstruct state.",
      "Consistency checks",
      "Hash mismatches halt sync and surface an alert for operator intervention.",
    ],
    "Fault tolerance": [
      "The model tolerates one Byzantine validator (arbitrary misbehavior) and continues to finalize blocks with three correct replicas.",
      "Liveness",
      "Network partitions that isolate fewer than three replicas pause commits until connectivity restores.",
    ],
    "Threat model": [
      "Adversary controls up to one validator and can observe, delay, or modify network messages. Cannot break SHA-256 or Ed25519.",
      "Out of scope",
      "Side channels, key compromise, denial of service, and validator collusion beyond threshold.",
    ],
    "Known limitations": [
      "This is an educational frontend model. No persistent storage, no P2P networking, no production cryptography, no access control.",
      "Intended use",
      "Classroom demos, architecture reviews, and prototype validation. Not for production deployment.",
    ],
  }

  const [description, subtitle, detail] = copy[name] || [
    "Documentation for this section is being prepared.",
    "",
    "",
  ]

  return (
    <>
      <p>{description}</p>
      {subtitle && (
        <>
          <h3>{subtitle}</h3>
          <p>{detail}</p>
        </>
      )}
    </>
  )
}

export function Docs() {
  const [section, setSection] = useState("System architecture")

  return (
    <>
      <PageHead
        title="Documentation"
        desc="Technical reference for the VERILOCK educational ledger model."
      />
      <div className="docs-layout">
        <Panel className="docs-nav">
          <span className="eyebrow">ON THIS PAGE</span>
          {sections.map((s) => (
            <button
              key={s}
              className={section === s ? "active" : ""}
              onClick={() => setSection(s)}
            >
              {s}
            </button>
          ))}
        </Panel>
        <Panel className="doc-content">
          <span className="eyebrow">CONCEPT GUIDE</span>
          <h2>{section}</h2>
          {section === "System architecture" ? (
            <>
              <p>
                VERILOCK models a permissioned, hash-linked ledger with
                deterministic browser-side fixtures. Transactions pass through
                validation, block construction, an educational PBFT-style
                workflow, and replicated ledger storage.
              </p>
              <Architecture />
              <h3>Component boundaries</h3>
              <div className="doc-grid">
                <div>
                  <strong>Transaction validation</strong>
                  <p>
                    Checks schema, asset state, nonce uniqueness, and fixture
                    signature status before queueing.
                  </p>
                </div>
                <div>
                  <strong>Block construction</strong>
                  <p>
                    Orders accepted transactions, builds a Merkle root, and
                    links the previous block hash.
                  </p>
                </div>
                <div>
                  <strong>Consensus replicas</strong>
                  <p>
                    Four modeled validators illustrate proposal, prepare,
                    commit, and finalization phases.
                  </p>
                </div>
                <div>
                  <strong>Verification</strong>
                  <p>
                    Browser Web Crypto computes SHA-256 hashes and Merkle paths
                    for selected demonstrations.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <DocSection name={section} />
          )}
        </Panel>
      </div>
    </>
  )
}
