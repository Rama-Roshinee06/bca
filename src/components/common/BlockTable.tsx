import { Hash } from "./Hash"
import { Badge } from "./Badge"
import { Icon } from "./Icon"
import type { Block } from "../../types"

interface BlockTableProps {
  rows: Block[]
  onSelect: (height: number) => void
  compact?: boolean
}

export function BlockTable({
  rows,
  onSelect,
  compact = false,
}: BlockTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Height</th>
            <th>Block hash</th>
            {!compact && <th>Previous hash</th>}
            <th>Txs</th>
            <th>Validator</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.height} onClick={() => onSelect(b.height)}>
              <td>
                <strong className="link">#{b.height.toLocaleString()}</strong>
              </td>
              <td>
                <Hash value={b.hash} />
              </td>
              {!compact && (
                <td>
                  <Hash value={b.prev} />
                </td>
              )}
              <td>{b.count}</td>
              <td>{b.validator}</td>
              <td>
                <Badge tone="good">{b.status}</Badge>
              </td>
              <td>
                <Icon name="chevron" size={14} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
