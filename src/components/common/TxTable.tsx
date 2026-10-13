import { Hash } from "./Hash"
import { Badge } from "./Badge"
import { Icon } from "./Icon"
import type { Transaction } from "../../types"

interface TxTableProps {
  rows: Transaction[]
  onSelect: (id: string) => void
}

export function TxTable({ rows, onSelect }: TxTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Asset</th>
            <th>Type</th>
            <th>Block</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id} onClick={() => onSelect(t.id)}>
              <td>
                <Hash value={t.id} />
              </td>
              <td>
                <strong>{t.asset}</strong>
              </td>
              <td>{t.type}</td>
              <td>{t.block ? `#${t.block}` : "—"}</td>
              <td>
                <Badge tone={t.status === "Committed" ? "good" : "warn"}>
                  {t.status}
                </Badge>
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
