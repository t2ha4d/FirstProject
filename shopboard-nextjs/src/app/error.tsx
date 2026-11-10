'use client'

import { Icon } from '../shared/ui/Icon'
import { StatePanel } from '../shared/ui/StatePanel'

export interface ErrorPageProps {
  retry: () => void
}

/**
 * The last safety net, for crashes nobody expected. Failed API requests never get here:
 * every data region shows its own error and "Try again".
 */
export default function ErrorPage({ retry }: ErrorPageProps) {
  return (
    <div className="section">
      <StatePanel
        art={<Icon name="alert" size={36} />}
        title="Something went wrong"
        description="An unexpected error stopped this page from loading."
        heading="h1"
        role="alert"
      >
        <button type="button" className="retry-btn" onClick={retry}>
          Try again
        </button>
      </StatePanel>
    </div>
  )
}
