import { CX, CY } from './geometry'

export interface WatchHandsProps {
  dialRadius: number
  handColor: string
  accentColor: string
}

const HANDS = [
  { id: 'hour', angle: 305, tail: 8, reach: 0.52, width: 4.5 },
  { id: 'minute', angle: 60, tail: 8, reach: 0.76, width: 3 },
  { id: 'second', angle: 200, tail: 14, reach: 0.84, width: 1.2 },
]

/** Hands at the classic 10:10 display position, centre pin and crystal glare. */
export function WatchHands({ dialRadius, handColor, accentColor }: WatchHandsProps) {
  return (
    <g>
      <g strokeLinecap="round">
        {HANDS.map(({ id, angle, tail, reach, width }) => (
          <line
            key={id}
            transform={`rotate(${angle} ${CX} ${CY})`}
            x1={CX}
            x2={CX}
            y1={CY + tail}
            y2={CY - dialRadius * reach}
            stroke={id === 'second' ? accentColor : handColor}
            strokeWidth={width}
          />
        ))}
      </g>
      <circle cx={CX} cy={CY} r="3.5" fill={accentColor} />
      <ellipse
        cx="78"
        cy="136"
        rx="34"
        ry="22"
        transform="rotate(-32 78 136)"
        fill="#fff"
        fillOpacity="0.07"
      />
    </g>
  )
}
