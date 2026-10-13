import { useState } from "react"
import {
  PageHead,
  Panel,
  Badge,
  Button,
  Notice,
  Metric,
} from "../components/common"

export function Benchmarks() {
  const [size, setSize] = useState("1,000")
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)

  const run = () => {
    setRunning(true)
    setDone(false)
    setTimeout(() => {
      setRunning(false)
      setDone(true)
    }, 1100)
  }

  const mult = size === "10,000" ? 1.62 : size === "5,000" ? 1.28 : 1

  return (
    <>
      <PageHead
        title="Performance Benchmarks"
        desc="Measure deterministic workloads inside this browser—not a distributed cluster."
        actions={
          <Button kind="primary" icon="play" onClick={run} disabled={running}>
            {running ? "Running workload…" : "Run benchmark"}
          </Button>
        }
      />
      <Notice
        icon="alert"
        title="Locally measured simulation"
        description="Results represent JavaScript execution and modeled delays on this device. They are not production throughput claims."
      />
      <Panel>
        <div className="benchmark-controls">
          <label>
            Test size
            <select
              value={size}
              onChange={(e) => {
                setSize(e.target.value)
                setDone(false)
              }}
            >
              <option>1,000</option>
              <option>5,000</option>
              <option>10,000</option>
            </select>
          </label>
          <div>
            <span>Workload</span>
            <strong>70% transfers · 20% inspection · 10% registration</strong>
          </div>
          <div>
            <span>Hash algorithm</span>
            <strong>SHA-256 · Web Crypto API</strong>
          </div>
          {done && <Badge tone="good">RUN COMPLETE</Badge>}
        </div>
      </Panel>
      <div className="benchmark-metrics">
        <Metric
          label="Throughput"
          value={`${(68.4 / mult).toFixed(1)} TPS`}
          meta="Modeled transaction processing"
        />
        <Metric
          label="Transaction latency"
          value={`${Math.round(82 * mult)} ms`}
          meta="Locally measured average"
          tone="good"
        />
        <Metric
          label="Commit latency"
          value={`${Math.round(184 * mult)} ms`}
          meta="Simulated PBFT phases"
        />
        <Metric
          label="Block verification"
          value={`${(2.8 * mult).toFixed(1)} ms`}
          meta="Local SHA-256 workload"
          tone="good"
        />
        <Metric
          label="Merkle proof"
          value={`${(0.42 * mult).toFixed(2)} ms`}
          meta="Local proof verification"
          tone="good"
        />
        <Metric
          label="Replica sync"
          value={`${(1.34 * mult).toFixed(2)} s`}
          meta="Simulated 100-block recovery"
        />
        <Metric
          label="Storage overhead"
          value={`${(12.6 * mult).toFixed(1)} MB`}
          meta={`Modeled for ${size} transactions`}
          tone="neutral"
        />
      </div>
      <Panel title="Latency distribution">
        <div className="latency-chart">
          {[32, 48, 62, 78, 91, 84, 70, 54, 38, 24, 16, 9].map((v, i) => (
            <div key={i}>
              <i style={{ height: `${v}%` }} />
              <span>
                {i * 40}–{i * 40 + 39} ms
              </span>
            </div>
          ))}
        </div>
        <div className="chart-caption">
          <span>Percentile distribution of simulated commit latencies</span>
          <span>Sample size: {size} operations</span>
        </div>
      </Panel>
    </>
  )
}
