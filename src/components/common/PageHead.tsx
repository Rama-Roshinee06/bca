import type { ReactNode } from "react"

interface PageHeadProps {
  title: string
  desc: string
  actions?: ReactNode
}

export function PageHead({ title, desc, actions }: PageHeadProps) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  )
}
