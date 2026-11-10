/** The hero's silver watch (the store's Silver Watch), drawn at the classic 10:10 position. */

const CX = 100
const CY = 170
const DIAL_RADIUS = 66
const DIAL = '#a4532f'
const MARKER = '#efe6d6'
const STRAP = '#46301f'
const METAL = 'url(#hero-watch-metal)'

const HOUR_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30)
const LUGS = [
  [66, 100],
  [122, 100],
  [66, 226],
  [122, 226],
]
const STRAPS = [
  'M67 112 L72 6 Q100 0 128 6 L133 112 Z',
  'M67 228 L72 334 Q100 340 128 334 L133 228 Z',
]
const HANDS = [
  { id: 'hour', angle: 305, tail: 8, reach: 0.52, width: 4.5 },
  { id: 'minute', angle: 60, tail: 8, reach: 0.76, width: 3 },
  { id: 'second', angle: 200, tail: 14, reach: 0.84, width: 1.2 },
]

/** Point at `radius` from the dial centre, `angle` degrees clockwise from 12 o'clock. */
function polar(angle: number, radius: number) {
  const radians = ((angle - 90) * Math.PI) / 180
  return { x: CX + radius * Math.cos(radians), y: CY + radius * Math.sin(radians) }
}

export interface HeroWatchProps {
  className?: string
}

export function HeroWatch({ className }: HeroWatchProps) {
  return (
    <svg className={className} viewBox="0 0 200 340" aria-hidden="true">
      <defs>
        <linearGradient id="hero-watch-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eeece7" />
          <stop offset="1" stopColor="#94928c" />
        </linearGradient>
        <radialGradient id="hero-watch-dial" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#000" stopOpacity="0.14" />
        </radialGradient>
      </defs>

      {STRAPS.map((path) => (
        <path key={path} d={path} fill={STRAP} />
      ))}
      {[76, 124].map((x) => (
        <line
          key={x}
          x1={x}
          x2={x}
          y1="12"
          y2="328"
          stroke="#fff"
          strokeOpacity="0.35"
          strokeDasharray="5 4"
        />
      ))}

      {LUGS.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="12" height="14" rx="3" fill={METAL} />
      ))}
      <rect x="172" y="160" width="9" height="20" rx="2.5" fill={METAL} />
      <circle cx={CX} cy={CY} r="74" fill={METAL} />

      <circle cx={CX} cy={CY} r={DIAL_RADIUS} fill={DIAL} />
      <circle cx={CX} cy={CY} r={DIAL_RADIUS} fill="url(#hero-watch-dial)" />
      {HOUR_ANGLES.map((angle) => {
        const from = polar(angle, DIAL_RADIUS - 4)
        const to = polar(angle, DIAL_RADIUS - (angle % 90 === 0 ? 15 : 11))
        return (
          <line
            key={angle}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={MARKER}
            strokeWidth="2"
            strokeLinecap="round"
          />
        )
      })}
      <text
        x={CX}
        y={CY - DIAL_RADIUS * 0.4}
        textAnchor="middle"
        fontSize="10"
        letterSpacing="2.5"
        fontFamily="'Cormorant Garamond', serif"
        fontWeight="600"
        fill={MARKER}
      >
        WTC
      </text>
      {[-27, 27].map((offset) => (
        <g key={offset} stroke={MARKER}>
          <circle
            cx={CX + offset}
            cy={CY + 4}
            r="12"
            fill="#000"
            fillOpacity="0.1"
            strokeOpacity="0.6"
            strokeWidth="0.8"
          />
          <line x1={CX + offset} y1={CY + 4} x2={CX + offset} y2={CY - 4} strokeWidth="1.2" />
        </g>
      ))}

      <g strokeLinecap="round" stroke={MARKER}>
        {HANDS.map(({ id, angle, tail, reach, width }) => (
          <line
            key={id}
            transform={`rotate(${angle} ${CX} ${CY})`}
            x1={CX}
            x2={CX}
            y1={CY + tail}
            y2={CY - DIAL_RADIUS * reach}
            strokeWidth={width}
          />
        ))}
      </g>
      <circle cx={CX} cy={CY} r="3.5" fill={MARKER} />
      <ellipse
        cx="78"
        cy="136"
        rx="34"
        ry="22"
        transform="rotate(-32 78 136)"
        fill="#fff"
        fillOpacity="0.07"
      />
    </svg>
  )
}
