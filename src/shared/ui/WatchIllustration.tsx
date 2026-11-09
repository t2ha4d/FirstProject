import { useId } from 'react'
import type { CaseTone, WatchDesign } from '../types'
import { dialRadiusFor } from './watch/geometry'
import { WatchCase } from './watch/WatchCase'
import { WatchDial } from './watch/WatchDial'
import { WatchHands } from './watch/WatchHands'
import { WatchStrap } from './watch/WatchStrap'

export interface WatchIllustrationProps {
  design: WatchDesign
  label?: string
  className?: string
}

const METALS: Record<CaseTone, [string, string]> = {
  steel: ['#eeece7', '#94928c'],
  gold: ['#ecd7a8', '#a27c45'],
  black: ['#5a5753', '#1f1e1c'],
}

/** A drawn watch, set to the classic 10:10 display position. */
export function WatchIllustration({ design, label, className }: WatchIllustrationProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '')
  const metalId = `metal-${rawId}`
  const dialId = `dial-${rawId}`
  const [metalLight, metalDark] = METALS[design.caseTone]

  return (
    <svg
      className={className}
      viewBox="0 0 200 340"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={metalId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={metalLight} />
          <stop offset="1" stopColor={metalDark} />
        </linearGradient>
        <radialGradient id={dialId} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#000" stopOpacity="0.14" />
        </radialGradient>
      </defs>

      <WatchStrap color={design.strapColor} strapStyle={design.strapStyle} />
      <WatchCase metalFill={`url(#${metalId})`} bezelColor={design.bezelColor} />
      <WatchDial design={design} shadingFill={`url(#${dialId})`} />
      <WatchHands
        dialRadius={dialRadiusFor(Boolean(design.bezelColor))}
        handColor={design.markerColor}
        accentColor={design.accentColor}
      />
    </svg>
  )
}
