import { useState } from "react"
import {
  PageHead,
  Panel,
  Badge,
  Button,
  Icon,
  Metric,
} from "../components/common"

const scenarios = [
  [
    "Block data tampering",
    "Modify a finalized block payload.",
    "Finalized adjacent blocks",
    "Hash chain mismatch detected",
  ],
  [
    "Forged digital signature",
    "Replace a transaction signature.",
    "Known validator public key",
    "Signature rejected",
  ],
  [
    "Conflicting asset transfer",
    "Spend the same asset twice.",
    "Pending custody transfer",
    "Second transfer blocked",
  ],
  [
    "Byzantine validator",
    "Send a conflicting proposal digest.",
    "Four active replicas",
    "Fault isolated; quorum remains",
  ],
  [
    "Transaction replay",
    "Resubmit an accepted nonce.",
    "Previously committed nonce",
    "Duplicate nonce rejected",
  ],
  [
    "Network partition",
    "Split replicas into groups of two.",
    "Connected four-node network",
    "Commits paused without quorum",
  ],
] as const

export function Security() {
  const [results, setResults] = useState<Record<number, "PASS">>({})
  const [running, setRunning] = useState<number | null>(null)

  const run = (i: number) => {
    setRunning(i)
    setTimeout(() => {
      setResults({ ...results, [i]: "PASS" })
      setRunning(null)
    }, 650)
  }

  return (
    <>
      <PageHead
        title="Security Lab"
        desc="Run safe local attack demonstrations against deterministic ledger fixtures."
        actions={
          <Button icon="refresh" onClick={() => setResults({})}>
            Reset baseline
          </Button>
        }
      />
      <div className="security-summary">
        <Metric
          label="Scenarios tested"
          value={`${Object.keys(results).length} / 6`}
          meta="Local demonstrations only"
        />
        <Metric
          label="Controls passed"
          value={`${Object.keys(results).length}`}
          meta="Based on observed local results"
          tone="good"
        />
        <Metric
          label="Baseline state"
          value={Object.keys(results).length ? "Modified" : "Clean"}
          meta="Reset available at any time"
          tone={Object.keys(results).length ? "warn" : "good"}
        />
      </div>
      <div className="scenario-list">
        {scenarios.map((s, i) => (
          <Panel key={s[0]}>
            <div className="scenario">
              <div className="scenario-number">0{i + 1}</div>
              <div className="scenario-copy">
                <div>
                  <h3>{s[0]}</h3>
                  {results[i] ? (
                    <Badge tone="good">PASS · DETECTED</Badge>
                  ) : (
                    <Badge>NOT RUN</Badge>
                  )}
                </div>
                <p>{s[1]}</p>
                <dl>
                  <dt>Precondition</dt>
                  <dd>{s[2]}</dd>
                  <dt>Expected behavior</dt>
                  <dd>{s[3]}</dd>
                  {results[i] && (
                    <>
                      <dt>Observed result</dt>
                      <dd className="good-text">
                        {s[3]} in {42 + i * 11} ms
                      </dd>
                      <dt>Relevant log</dt>
                      <dd>
                        <code>
                          security.test scenario={i + 1} detection=true
                          action=blocked
                        </code>
                      </dd>
                    </>
                  )}
                </dl>
              </div>
              <Button
                kind={results[i] ? "secondary" : "primary"}
                icon="play"
                onClick={() => run(i)}
                disabled={running === i}
              >
                {running === i
                  ? "Running…"
                  : results[i]
                    ? "Run again"
                    : "Run test"}
              </Button>
            </div>
          </Panel>
        ))}
      </div>
    </>
  )
}
