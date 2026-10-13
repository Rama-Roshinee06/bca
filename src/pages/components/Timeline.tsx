import { Icon } from "../../components/common/Icon"

export function Timeline() {
  const events = [
    ["10:42:18", "Block 12,847 finalized", "4/4 commits received", "good"],
    ["10:42:17", "Commit quorum reached", "Proposal 0x8fd2…ac91", "info"],
    ["10:42:16", "Prepare phase completed", "4 validator responses", "info"],
    ["10:42:15", "Proposal broadcast", "Leader VAL-03", "neutral"],
  ]

  return (
    <div className="timeline">
      {events.map(([time, title, desc, tone]) => (
        <div className="event" key={time + title}>
          <i className={tone} />
          <time>{time}</time>
          <div>
            <strong>{title}</strong>
            <span>{desc}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
