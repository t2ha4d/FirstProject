import { useId } from 'react'
import type { CaseTone, WatchDesign } from '../types'

export interface WatchIllustrationProps {
  design: WatchDesign
  label?: string
  className?: string
}

const CX = 100
const CY = 170
const HOUR_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30)
const NUMERALS = [{ text: '12', angle: 0 }, { text: '3', angle: 90 }, { text: '6', angle: 180 }, { text: '9', angle: 270 }]
const STRAP_ROWS = Array.from({ length: 13 }, (_, i) => i * 8 + 8)
const METALS: Record<CaseTone, [string, string]> = {
  steel: ['#eeece7', '#94928c'],
  gold: ['#ecd7a8', '#a27c45'],
  black: ['#5a5753', '#1f1e1c'],
}
const STRAP_TOP = 'M67 112 L72 6 Q100 0 128 6 L133 112 Z'
const STRAP_BOTTOM = 'M67 228 L72 334 Q100 340 128 334 L133 228 Z'

function polar(angle: number, radius: number) {
  const radians = ((angle - 90) * Math.PI) / 180
  return { x: CX + radius * Math.cos(radians), y: CY + radius * Math.sin(radians) }
}

/** A drawn watch, set to the classic 10:10 display position. */
export function WatchIllustration({ design, label, className }: WatchIllustrationProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '')
  const metalId = `metal-${rawId}`
  const dialId = `dial-${rawId}`
  const { dialColor, markerColor, accentColor, strapColor, strapStyle, caseTone, dialStyle, bezelColor, hasSubdials, hasDate } = design
  const dialRadius = bezelColor ? 56 : 66
  const ticks = dialStyle === 'minimal' ? [0, 90, 180, 270] : HOUR_ANGLES

  return (
    <svg className={className} viewBox="0 0 200 340" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <linearGradient id={metalId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={METALS[caseTone][0]} />
          <stop offset="1" stopColor={METALS[caseTone][1]} />
        </linearGradient>
        <radialGradient id={dialId} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#000" stopOpacity="0.14" />
        </radialGradient>
      </defs>

      {/* Strap */}
      {[STRAP_TOP, STRAP_BOTTOM].map((path) => <path key={path} d={path} fill={strapColor} />)}
      {strapStyle === 'leather' && [76, 124].map((x) => (
        <line key={x} x1={x} x2={x} y1="12" y2="328" stroke="#fff" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="5 4" />
      ))}
      {strapStyle !== 'leather' && STRAP_ROWS.flatMap((offset) => [offset, 340 - offset]).map((y) => (
        <line key={y} x1="68" x2="132" y1={y} y2={y} stroke="#000" strokeOpacity={strapStyle === 'steel' ? 0.28 : 0.12} strokeWidth="1" />
      ))}

      {/* Case */}
      {[[66, 100], [122, 100], [66, 226], [122, 226]].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="12" height="14" rx="3" fill={`url(#${metalId})`} />
      ))}
      <rect x="172" y="160" width="9" height="20" rx="2.5" fill={`url(#${metalId})`} />
      <circle cx={CX} cy={CY} r="74" fill={`url(#${metalId})`} />
      {bezelColor && <circle cx={CX} cy={CY} r="69" fill={bezelColor} />}
      {bezelColor && HOUR_ANGLES.map((angle) => {
        const from = polar(angle, 60)
        const to = polar(angle, 66)
        return <line key={angle} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#efe6d6" strokeWidth="1.5" />
      })}

      {/* Dial */}
      <circle cx={CX} cy={CY} r={dialRadius} fill={dialColor} />
      <circle cx={CX} cy={CY} r={dialRadius} fill={`url(#${dialId})`} />
      {ticks.map((angle) => {
        if (dialStyle === 'numeral' && angle % 90 === 0) return null
        const from = polar(angle, dialRadius - 4)
        const to = polar(angle, dialRadius - (angle % 90 === 0 ? 15 : 11))
        return <line key={angle} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={markerColor} strokeWidth="2" strokeLinecap="round" />
      })}
      {dialStyle === 'numeral' && NUMERALS.map(({ text, angle }) => {
        const { x, y } = polar(angle, dialRadius - 13)
        return <text key={text} x={x} y={y + 5} textAnchor="middle" fontSize="15" fontFamily="Jost, sans-serif" fill={markerColor}>{text}</text>
      })}
      <text x={CX} y={CY - dialRadius * 0.4} textAnchor="middle" fontSize="10" letterSpacing="2.5" fontFamily="'Cormorant Garamond', serif" fontWeight="600" fill={markerColor}>WTC</text>
      {hasSubdials && [-27, 27].map((offset) => (
        <g key={offset}>
          <circle cx={CX + offset} cy={CY + 4} r="12" fill="#000" fillOpacity="0.1" stroke={markerColor} strokeOpacity="0.6" strokeWidth="0.8" />
          <line x1={CX + offset} y1={CY + 4} x2={CX + offset} y2={CY - 4} stroke={markerColor} strokeWidth="1.2" />
        </g>
      ))}
      {hasDate && <rect x={CX + dialRadius - 29} y={CY - 6} width="14" height="12" rx="1.5" fill="#f7f2e8" stroke={markerColor} strokeOpacity="0.5" strokeWidth="0.5" />}
      {hasDate && <text x={CX + dialRadius - 22} y={CY + 3.5} textAnchor="middle" fontSize="9" fontFamily="Jost, sans-serif" fill="#2f2a26">12</text>}

      {/* Hands at 10:10 */}
      <g strokeLinecap="round">
        <line transform={`rotate(305 ${CX} ${CY})`} x1={CX} x2={CX} y1={CY + 8} y2={CY - dialRadius * 0.52} stroke={markerColor} strokeWidth="4.5" />
        <line transform={`rotate(60 ${CX} ${CY})`} x1={CX} x2={CX} y1={CY + 8} y2={CY - dialRadius * 0.76} stroke={markerColor} strokeWidth="3" />
        <line transform={`rotate(200 ${CX} ${CY})`} x1={CX} x2={CX} y1={CY + 14} y2={CY - dialRadius * 0.84} stroke={accentColor} strokeWidth="1.2" />
      </g>
      <circle cx={CX} cy={CY} r="3.5" fill={accentColor} />
      <ellipse cx="78" cy="136" rx="34" ry="22" transform="rotate(-32 78 136)" fill="#fff" fillOpacity="0.07" />
    </svg>
  )
}
