export function Log() {
  const logs = [
    "INFO  10:42:18  ledger.commit height=12847 tx=2",
    "INFO  10:42:17  pbft.quorum votes=4 required=3",
    "INFO  10:42:16  signature.verify result=valid",
    "WARN  10:40:04  node.latency id=VAL-04 rtt=82ms",
    "INFO  10:39:51  replica.sync status=complete",
  ]

  return (
    <div className="log">
      {logs.map((x, i) => (
        <code key={x} className={i === 3 ? "warning" : ""}>
          {x}
        </code>
      ))}
    </div>
  )
}
