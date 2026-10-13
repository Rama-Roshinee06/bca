import { Icon } from "./Icon"
import type { ReactNode } from "react"
import type { Tone } from "../../types"

interface BadgeProps {
  children: ReactNode
  tone?: Tone
  className?: string
}

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: BadgeProps) {
  return (
    <span className={`badge ${tone} ${className}`}>
      <i />
      {children}
    </span>
  )
}
