import { Icon } from "../../components/common/Icon"
import { Badge } from "../../components/common/Badge"

export function ValidatorList() {
  const validators = [
    "VAL-01 · Primary",
    "VAL-02 · Replica",
    "VAL-03 · Replica",
    "VAL-04 · Replica",
  ]

  return (
    <div className="validator-list">
      {validators.map((v, i) => (
        <div className="validator" key={v}>
          <div className="node-icon">
            <Icon name="nodes" />
          </div>
          <div>
            <strong>{v}</strong>
            <span>Height 12,847 · {18 + i * 3} ms</span>
          </div>
          <Badge tone="good">Online</Badge>
        </div>
      ))}
    </div>
  )
}
