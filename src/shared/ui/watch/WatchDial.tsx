import type { WatchDesign } from '../../types'
import { CX, CY, HOUR_ANGLES, dialRadiusFor, polar } from './geometry'

export interface WatchDialProps {
  design: WatchDesign
  /** SVG paint reference for the dial shading, e.g. `url(#dial-1)`. */
  shadingFill: string
}

const NUMERALS = [
  { text: '12', angle: 0 },
  { text: '3', angle: 90 },
  { text: '6', angle: 180 },
  { text: '9', angle: 270 },
]
const QUARTER_ANGLES = [0, 90, 180, 270]
const SUBDIAL_OFFSETS = [-27, 27]

/** Dial face: hour markers or numerals, brand mark, sub-dials and date window. */
export function WatchDial({ design, shadingFill }: WatchDialProps) {
  const { dialColor, markerColor, dialStyle, bezelColor, hasSubdials, hasDate } = design
  const radius = dialRadiusFor(Boolean(bezelColor))
  const ticks = dialStyle === 'minimal' ? QUARTER_ANGLES : HOUR_ANGLES

  return (
    <g>
      <circle cx={CX} cy={CY} r={radius} fill={dialColor} />
      <circle cx={CX} cy={CY} r={radius} fill={shadingFill} />
      {ticks.map((angle) => {
        if (dialStyle === 'numeral' && angle % 90 === 0) return null
        const from = polar(angle, radius - 4)
        const to = polar(angle, radius - (angle % 90 === 0 ? 15 : 11))
        return (
          <line
            key={angle}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={markerColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        )
      })}
      {dialStyle === 'numeral' &&
        NUMERALS.map(({ text, angle }) => {
          const { x, y } = polar(angle, radius - 13)
          return (
            <text
              key={text}
              x={x}
              y={y + 5}
              textAnchor="middle"
              fontSize="15"
              fontFamily="Jost, sans-serif"
              fill={markerColor}
            >
              {text}
            </text>
          )
        })}
      <text
        x={CX}
        y={CY - radius * 0.4}
        textAnchor="middle"
        fontSize="10"
        letterSpacing="2.5"
        fontFamily="'Cormorant Garamond', serif"
        fontWeight="600"
        fill={markerColor}
      >
        WTC
      </text>
      {hasSubdials &&
        SUBDIAL_OFFSETS.map((offset) => (
          <g key={offset}>
            <circle
              cx={CX + offset}
              cy={CY + 4}
              r="12"
              fill="#000"
              fillOpacity="0.1"
              stroke={markerColor}
              strokeOpacity="0.6"
              strokeWidth="0.8"
            />
            <line
              x1={CX + offset}
              y1={CY + 4}
              x2={CX + offset}
              y2={CY - 4}
              stroke={markerColor}
              strokeWidth="1.2"
            />
          </g>
        ))}
      {hasDate && (
        <g>
          <rect
            x={CX + radius - 29}
            y={CY - 6}
            width="14"
            height="12"
            rx="1.5"
            fill="#f7f2e8"
            stroke={markerColor}
            strokeOpacity="0.5"
            strokeWidth="0.5"
          />
          <text
            x={CX + radius - 22}
            y={CY + 3.5}
            textAnchor="middle"
            fontSize="9"
            fontFamily="Jost, sans-serif"
            fill="#2f2a26"
          >
            12
          </text>
        </g>
      )}
    </g>
  )
}
