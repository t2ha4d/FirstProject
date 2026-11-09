import { CX, CY, HOUR_ANGLES, polar } from './geometry'

export interface WatchCaseProps {
  /** SVG paint reference for the metal, e.g. `url(#metal-1)`. */
  metalFill: string
  bezelColor?: string
}

const LUGS = [
  [66, 100],
  [122, 100],
  [66, 226],
  [122, 226],
]

/** Lugs, crown, case body and the optional dive bezel. */
export function WatchCase({ metalFill, bezelColor }: WatchCaseProps) {
  return (
    <g>
      {LUGS.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="12" height="14" rx="3" fill={metalFill} />
      ))}
      <rect x="172" y="160" width="9" height="20" rx="2.5" fill={metalFill} />
      <circle cx={CX} cy={CY} r="74" fill={metalFill} />
      {bezelColor && <circle cx={CX} cy={CY} r="69" fill={bezelColor} />}
      {bezelColor &&
        HOUR_ANGLES.map((angle) => {
          const from = polar(angle, 60)
          const to = polar(angle, 66)
          return (
            <line
              key={angle}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#efe6d6"
              strokeWidth="1.5"
            />
          )
        })}
    </g>
  )
}
