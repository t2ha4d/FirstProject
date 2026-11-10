import type { ReactNode } from 'react'

export interface StatePanelProps {
  /** An icon shown above the title. */
  art: ReactNode
  title: string
  description: string
  /** The title element; use 'h1' when the panel is the whole page. */
  heading?: 'h1' | 'h2'
  /** 'alert' for errors, so screen readers announce them. */
  role?: 'alert'
  /** Buttons or links under the text. */
  children?: ReactNode
}

/** A centred message for error, empty and not-found states. */
export function StatePanel({
  art,
  title,
  description,
  heading: Heading = 'h2',
  role,
  children,
}: StatePanelProps) {
  return (
    <div className="state-panel" role={role}>
      <div className="state-icon">{art}</div>
      <Heading className="state-title">{title}</Heading>
      <p className="state-description">{description}</p>
      {children}
    </div>
  )
}
