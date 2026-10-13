interface ThroughputProps {
  range: string
}

export function Throughput({ range }: ThroughputProps) {
  const vals = [
    28, 31, 27, 36, 42, 39, 48, 44, 52, 49, 58, 54, 63, 59, 67, 62, 71, 66, 74,
    69, 78, 72, 81, 76,
  ]
  const shown =
    range === "1H"
      ? vals.slice(-8)
      : range === "6H"
        ? vals
        : [...vals.slice().reverse(), ...vals]

  const kpi = range === "1H" ? "72.1" : range === "24H" ? "58.3" : "64.8"

  return (
    <div className="chart-wrap">
      <div className="chart-kpi">
        <strong>{kpi} TPS</strong>
        <span>average · simulated</span>
      </div>
      <div className="chart">
        <div className="ylabels">
          <span>80</span>
          <span>60</span>
          <span>40</span>
          <span>20</span>
          <span>0</span>
        </div>
        <div className="bars">
          {shown.map((v, i) => (
            <i key={i} style={{ height: `${v}%` }} title={`${v} TPS`} />
          ))}
        </div>
      </div>
      <div className="xlabels">
        <span>
          {range === "1H" ? "11:00" : range === "6H" ? "06:00" : "Yesterday"}
        </span>
        <span>
          {range === "1H" ? "11:20" : range === "6H" ? "08:00" : "06:00"}
        </span>
        <span>
          {range === "1H" ? "11:40" : range === "6H" ? "10:00" : "12:00"}
        </span>
        <span>Now</span>
      </div>
    </div>
  )
}
