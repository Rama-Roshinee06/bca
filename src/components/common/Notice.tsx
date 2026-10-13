import { Icon } from "../common/Icon"

interface NoticeProps {
  icon?: string
  title: string
  description: string
  className?: string
}

export function Notice({
  icon = "alert",
  title,
  description,
  className = "",
}: NoticeProps) {
  return (
    <div className={`notice ${className}`}>
      <Icon name={icon} />
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
    </div>
  )
}
