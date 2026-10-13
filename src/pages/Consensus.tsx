import { useState } from "react"
import {
  PageHead,
  Panel,
  Badge,
  Button,
  Icon,
  Notice,
} from "../components/common"

export function Consensus() {
  const [stage, setStage] = useState(0)
  const [faulty, setFaulty] = useState(false)
  const [running, setRunning] = useState(false)

  const stages = ["Proposal", "Prepare", "Commit", "Finalization"]

  const run = () => {
    setRunning(true)
    setStage(0)
    ;[1, 2, 3].forEach((s, i) =>
      setTimeout(
        () => {
          setStage(s)
          if (s === 3) setRunning(false)
        },
        (i + 1) * 700,
      ),
    )
  }

  return (
    <>
      <PageHead
        title="Validators & Consensus"
        desc="Educational PBFT-style workflow for a four-replica permissioned network."
        actions={
          <Button kind="primary" icon="play" onClick={run} disabled={running}>
            {running ? "Simulation running…" : "Run consensus simulation"}
          </Button>
        }
      />
      <Notice
        icon="alert"
        title="Educational PBFT-style model"
        description="Classic PBFT requires n = 3f + 1. Four replicas can tolerate one Byzantine replica under protocol safety and liveness assumptions. This visualization is not a complete production PBFT implementation."
      />
      <Panel>
        <div className="stage-track">
          {stages.map((s, i) => (
            <div className={i <= stage ? "done" : ""} key={s}>
              <span>{i < stage ? <Icon name="check" size={14} /> : i + 1}</span>
              <strong>{s}</strong>
              <small>
                {
                  [
                    "Leader broadcasts block",
                    "Replicas validate",
                    "Quorum commits",
                    "Block appended",
                  ][i]
                }
              </small>
            </div>
          ))}
        </div>
      </Panel>
      <div className="consensus-grid">
        <Panel title="Replica responses" className="span-2">
          <div className="replica-grid">
            {[0, 1, 2, 3].map((i) => (
              <div
                className={`replica-card ${faulty && i === 3 ? "faulty" : ""}`}
                key={i}
              >
                <div className="replica-head">
                  <div className="node-icon">
                    <Icon name="nodes" />
                  </div>
                  <div>
                    <strong>VAL-0{i + 1}</strong>
                    <span>{i === 0 ? "Primary" : "Replica"}</span>
                  </div>
                  <Badge
                    tone={
                      faulty && i === 3 ? "bad" : stage === 3 ? "good" : "info"
                    }
                  >
                    {faulty && i === 3
                      ? "BYZANTINE"
                      : stages[stage].toUpperCase()}
                  </Badge>
                </div>
                <div className="vote">
                  <span>Proposal digest</span>
                  <code>
                    {faulty && i === 3 ? "0xdead…f001" : "0x8fd2…ac91"}
                  </code>
                </div>
                <div className="message-pulses">
                  {[0, 1, 2].map((x) => (
                    <i key={x} className={i <= stage ? "sent" : ""} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Commit decision">
          <div className="decision">
            <div className="decision-ring">
              <strong>{faulty ? "3/4" : "4/4"}</strong>
              <span>valid commits</span>
            </div>
            <Badge tone={stage === 3 ? "good" : "warn"}>
              {stage === 3 ? "FINALIZED" : "IN PROGRESS"}
            </Badge>
            <p>
              {faulty
                ? "One conflicting response waived; quorum threshold satisfied."
                : "All replicas validated and committed the proposal."}
            </p>
            {faulty && (
              <Badge tone="bad" className="mt-2">
                Byzantine behavior isolated
              </Badge>
            )}
          </div>
        </Panel>
      </div>
      <Panel>
        <div className="toolbar controls">
          <Button
            kind={faulty ? "secondary" : "danger"}
            onClick={() => setFaulty(!faulty)}
          >
            {faulty ? "Disable Byzantine replica" : "Enable Byzantine replica"}
          </Button>
          <Button
            icon="refresh"
            onClick={() => {
              setStage(0)
              setFaulty(false)
            }}
          >
            Reset simulation
          </Button>
        </div>
      </Panel>
    </>
  )
}
