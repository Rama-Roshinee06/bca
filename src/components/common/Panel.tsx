import type { ReactNode } from "react"

interface PanelProps {
  title?: string
  children: ReactNode
  action?: ReactNode
  className?: string
}

export function Panel({ title, children, action, className = "" }: PanelProps) {
  return (
    <section className={`panel ${className}`}>
      {title && (
        <div className="panel-head">
          <h2>{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
