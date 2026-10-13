import { useState } from "react"
import {
  PageHead,
  Panel,
  Badge,
  Button,
  Icon,
  Notice,
} from "../components/common"

export function Recovery() {
  const [disconnected, setDisconnected] = useState(false)
  const [progress, setProgress] = useState(100)
  const [syncing, setSyncing] = useState(false)

  const disconnect = () => {
    setDisconnected(true)
    setProgress(0)
  }

  const sync = () => {
    if (!disconnected) return
    setDisconnected(false)
    setSyncing(true)
    ;[20, 45, 70, 100].forEach((p, i) =>
      setTimeout(
        () => {
          setProgress(p)
          if (p === 100) setSyncing(false)
        },
        (i + 1) * 450,
      ),
    )
  }

  return (
    <>
      <PageHead
        title="Replication & Recovery"
        desc="Observe a local model of replica catch-up and hash consistency checks."
        actions={
          <>
            <Button kind="danger" onClick={disconnect} disabled={disconnected}>
              Disconnect VAL-04
            </Button>
            <Button
              kind="primary"
              icon="refresh"
              onClick={sync}
              disabled={!disconnected || syncing}
            >
              {syncing ? "Synchronizing…" : "Reconnect & synchronize"}
            </Button>
          </>
        }
      />
      <Notice
        icon="alert"
        title="Simulated recovery"
        description="Progress models block transfer and verification in the frontend. No distributed recovery occurs."
      />
      <Panel title="Replica synchronization status">
        <div className="replication-table">
          {[1, 2, 3, 4].map((i) => {
            const affected = i === 4
            const height =
              affected && (disconnected || syncing)
                ? 12839 + Math.round(progress / 13)
                : 12847
            return (
              <div className="replication-row" key={i}>
                <div className="node-icon">
                  <Icon name="nodes" />
                </div>
                <div>
                  <strong>VAL-0{i}</strong>
                  <span>
                    {i === 1 ? "Primary" : "Replica"} · Last sync{" "}
                    {affected && disconnected ? "8m ago" : "just now"}
                  </span>
                </div>
                <div>
                  <small>BLOCK HEIGHT</small>
                  <strong>{height.toLocaleString()}</strong>
                </div>
                <div>
                  <small>HASH CONSISTENCY</small>
                  <Badge
                    tone={
                      affected && (disconnected || syncing) ? "warn" : "good"
                    }
                  >
                    {affected && (disconnected || syncing)
                      ? "PENDING"
                      : "MATCH"}
                  </Badge>
                </div>
                <div className="sync-status">
                  <small>
                    {affected && (disconnected || syncing)
                      ? `MISSING #${height + 1}–#12,847`
                      : "SYNCHRONIZED"}
                  </small>
                  <div className="progress">
                    <i style={{ width: `${affected ? progress : 100}%` }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Panel>
      {(disconnected || syncing) && (
        <Panel title="Recovery operation">
          <div className="recovery-summary">
            <div>
              <Badge tone={disconnected ? "bad" : "info"}>
                {disconnected ? "DISCONNECTED" : "SYNCING"}
              </Badge>
              <strong>
                {disconnected
                  ? "VAL-04 is 8 blocks behind"
                  : `Verifying received blocks · ${progress}%`}
              </strong>
              <span>
                {disconnected
                  ? "Reconnect the replica to begin simulated block synchronization."
                  : "Each block's prevHash is verified against the local chain before commit."}
              </span>
            </div>
          </div>
        </Panel>
      )}
    </>
  )
}
