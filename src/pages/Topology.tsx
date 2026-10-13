import { useState } from "react"
import { PageHead, Panel, Badge, Button, Icon } from "../components/common"

export function Topology() {
  const [offline, setOffline] = useState<number[]>([])
  const [latency, setLatency] = useState(false)
  const [partition, setPartition] = useState(false)

  const toggle = (i: number) =>
    setOffline(
      offline.includes(i) ? offline.filter((x) => x !== i) : [...offline, i],
    )

  const quorumAvailable = !(offline.length > 1 || partition)

  return (
    <>
      <PageHead
        title="Network Topology"
        desc="Model validator connectivity, latency, and partitions in a four-replica network."
        actions={<Badge tone="warn">FRONTEND SIMULATION</Badge>}
      />
      <div className="toolbar controls">
        <Button icon="alert" onClick={() => toggle(3)}>
          {offline.includes(3) ? "Bring VAL-04 online" : "Take VAL-04 offline"}
        </Button>
        <Button onClick={() => setLatency(!latency)}>
          {latency ? "Remove latency" : "Introduce 180 ms latency"}
        </Button>
        <Button
          kind={partition ? "primary" : "danger"}
          onClick={() => setPartition(!partition)}
        >
          {partition ? "Restore connectivity" : "Simulate partition"}
        </Button>
        <Button
          icon="refresh"
          onClick={() => {
            setOffline([])
            setLatency(false)
            setPartition(false)
          }}
        >
          Reset network
        </Button>
      </div>
      <div className="topology-grid">
        <Panel title="Replica communication map" className="span-2">
          <div className={`topology ${partition ? "partitioned" : ""}`}>
            <div className="topo-lines">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                className={`topo-node n${i + 1} ${
                  offline.includes(i) ? "offline" : ""
                }`}
                onClick={() => toggle(i)}
              >
                <div className="node-ring">
                  <Icon name="nodes" />
                </div>
                <strong>VAL-0{i + 1}</strong>
                <span>{i === 0 ? "Primary" : "Replica"}</span>
                <Badge tone={offline.includes(i) ? "bad" : "good"}>
                  {offline.includes(i) ? "Offline" : "Online"}
                </Badge>
              </button>
            ))}
            {partition && (
              <div className="partition-line">
                <span>NETWORK PARTITION</span>
              </div>
            )}
          </div>
        </Panel>
        <Panel title="Network state">
          <div className="state-list">
            <div>
              <span>Quorum availability</span>
              <Badge tone={quorumAvailable ? "good" : "bad"}>
                {quorumAvailable ? "AVAILABLE" : "UNAVAILABLE"}
              </Badge>
            </div>
            <div>
              <span>Online replicas</span>
              <strong>{4 - offline.length} / 4</strong>
            </div>
            <div>
              <span>Simulated latency</span>
              <strong>{latency ? "180 ms" : "24 ms"}</strong>
            </div>
            <div>
              <span>Partition state</span>
              <strong>{partition ? "2 + 2 split" : "Connected"}</strong>
            </div>
            <div>
              <span>Safe commit threshold</span>
              <strong>3 of 4</strong>
            </div>
          </div>
        </Panel>
      </div>
    </>
  )
}
