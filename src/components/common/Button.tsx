import { Icon } from "./Icon"
import type { ReactNode } from "react"

type ButtonKind = "primary" | "secondary" | "danger" | "ghost"

interface ButtonProps {
  children?: ReactNode
  onClick?: () => void
  kind?: ButtonKind
  icon?: string
  disabled?: boolean
  type?: "button" | "submit"
  className?: string
}

export function Button({
  children,
  onClick,
  kind = "secondary",
  icon,
  disabled,
  type = "button",
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`btn ${kind} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <Icon name={icon} size={15} />}
      {children}
    </button>
  )
}
