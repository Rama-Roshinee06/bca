import { Icon } from "../common/Icon"
import { Badge } from "../common/Badge"

interface BreadcrumbProps {
  title: string
}

export function Breadcrumb({ title }: BreadcrumbProps) {
  return (
    <div className="breadcrumb">
      <span>Local Test Network</span>
      <Icon name="chevron" size={13} />
      <strong>{title}</strong>
      <Badge tone="warn">SIMULATED</Badge>
    </div>
  )
}
