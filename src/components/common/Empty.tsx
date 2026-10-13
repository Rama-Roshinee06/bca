import { Icon } from "./Icon"

interface EmptyProps {
  text: string
}

export function Empty({ text }: EmptyProps) {
  return (
    <div className="empty">
      <Icon name="search" />
      <strong>No matching records</strong>
      <span>{text}</span>
    </div>
  )
}
