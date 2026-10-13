import { Badge } from "./Badge"
import type { Tone } from "../../types"

interface MetricProps {
  label: string
  value: string
  meta: string
  tone?: Tone
}

export function Metric({ label, value, meta, tone = "info" }: MetricProps) {
  return (
    <div className="metric">
      <div className="metric-top">
        <span>{label}</span>
        <Badge tone={tone}>
          {tone === "good"
            ? "Healthy"
            : tone === "info"
              ? "Live"
              : tone === "warn"
                ? "Watch"
                : "Alert"}
        </Badge>
      </div>
      <strong>{value}</strong>
      <small>{meta}</small>
    </div>
  )
}
