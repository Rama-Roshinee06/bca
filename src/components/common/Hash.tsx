import { useState } from "react"
import { Icon } from "./Icon"
import { short } from "../../utils/hashing"

interface HashProps {
  value: string
  full?: boolean
}

export function Hash({ value, full = false }: HashProps) {
  const [copied, setCopied] = useState(false)

  const handleClick = () => {
    navigator.clipboard?.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 900)
  }

  return (
    <button className="hash" title={value} onClick={handleClick}>
      <span>{full ? value : short(value)}</span>
      <Icon name={copied ? "check" : "copy"} size={13} />
    </button>
  )
}
