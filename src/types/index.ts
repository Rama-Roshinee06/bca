export type Page = "overview" | "blocks" | "transactions" | "crypto" | "merkle" | "topology" | "consensus" | "provenance" | "recovery" | "security" | "benchmarks" | "docs"

export type Tone = "good" | "warn" | "bad" | "info" | "neutral"

export interface Transaction {
  id: string
  asset: string
  from: string
  to: string
  sig: string
  block: number | null
  time: string
  status: "Committed" | "Pending"
  type: string
}

export interface Block {
  height: number
  hash: string
  prev: string
  merkle: string
  count: number
  time: string
  validator: string
  status: string
}

export interface NavItem {
  id: Page
  label: string
  icon: string
  group?: boolean
}

export interface MetricData {
  label: string
  value: string
  meta: string
  tone?: Tone
}

export interface Validator {
  name: string
  role: string
  height: number
  latency: number
}

export interface ConsensusStage {
  name: string
  description: string
}

export interface ProvenanceEvent {
  name: string
  organization: string
  timestamp: string
  transaction: Transaction
}

export interface SecurityScenario {
  title: string
  description: string
  precondition: string
  expectedBehavior: string
}

export interface BenchmarkSize {
  label: string
  multiplier: number
}
