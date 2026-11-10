'use client'

import { Suspense, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Icon } from './Icon'
import { StatePanel } from './StatePanel'

export interface AsyncBoundaryProps {
  /** Shown while the data loads; should match the layout it replaces. */
  fallback: ReactNode
  /** Shown as the title when loading fails. */
  errorTitle: string
  /** Clears the failed request so "Try again" starts a new one. */
  onRetry: () => void
  children: ReactNode
}

function subscribeToNothing(): () => void {
  return () => {}
}

/** False on the server and during hydration, true in the browser afterwards. */
function useIsBrowser(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  )
}

/**
 * One data region: a Suspense boundary for loading and an error boundary with
 * "Try again". A slow or failing region never affects the rest of the page.
 */
export function AsyncBoundary({ fallback, errorTitle, onRetry, children }: AsyncBoundaryProps) {
  const isBrowser = useIsBrowser()

  // Data is read in the browser only: the server renders the skeleton, and the request cache
  // (module state) never runs on the server, where it would be shared between visitors.
  return (
    <ErrorBoundary
      onReset={onRetry}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <StatePanel
          art={<Icon name="alert" size={36} />}
          title={errorTitle}
          description={error instanceof Error ? error.message : 'Something went wrong.'}
          role="alert"
        >
          <button type="button" className="retry-btn" onClick={resetErrorBoundary}>
            Try again
          </button>
        </StatePanel>
      )}
    >
      {isBrowser ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </ErrorBoundary>
  )
}
