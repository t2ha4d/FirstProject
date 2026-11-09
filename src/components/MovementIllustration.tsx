export interface MovementIllustrationProps {
  label: string
}

interface Gear {
  id: string
  x: number
  y: number
  radius: number
  teeth: number
  color: string
  spin: 'cw' | 'ccw'
}

const GEARS: Gear[] = [
  { id: 'main', x: 170, y: 170, radius: 92, teeth: 26, color: '#c8a877', spin: 'cw' },
  { id: 'second', x: 322, y: 118, radius: 62, teeth: 18, color: '#d9c3a3', spin: 'ccw' },
  { id: 'third', x: 322, y: 268, radius: 48, teeth: 14, color: '#b98a5e', spin: 'cw' },
  { id: 'fourth', x: 96, y: 330, radius: 40, teeth: 12, color: '#d9c3a3', spin: 'ccw' },
]
const JEWELS = [[60, 60], [240, 40], [420, 200], [210, 330], [400, 60]]
const PLATE_LINES = [60, 110, 160, 210, 260, 310, 360]

/** Builds a closed toothed-wheel outline centred on the origin. */
function gearPath(radius: number, teeth: number): string {
  const depth = 7
  const step = (Math.PI * 2) / teeth
  const points = Array.from({ length: teeth }, (_, i) => {
    const angle = i * step
    return [
      [radius - depth, angle],
      [radius, angle + step * 0.15],
      [radius, angle + step * 0.45],
      [radius - depth, angle + step * 0.6],
    ]
  }).flat()
  const coords = points.map(([r, a]) => `${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`)
  return `M${coords.join('L')}Z`
}

/** Exposed mechanical movement with slowly turning wheels. */
export function MovementIllustration({ label }: MovementIllustrationProps) {
  return (
    <svg className="movement-art" viewBox="0 0 480 400" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      <rect width="480" height="400" fill="#4a3a2d" />
      {PLATE_LINES.map((y) => (
        <path key={y} d={`M-10 ${y}Q240 ${y - 34} 490 ${y}`} stroke="#fff" strokeOpacity="0.04" strokeWidth="14" fill="none" />
      ))}
      {GEARS.map(({ id, x, y, radius, teeth, color, spin }) => (
        <g key={id} transform={`translate(${x} ${y})`}>
          <g className={`gear gear-${spin}`}>
            <path d={gearPath(radius, teeth)} fill={color} />
            <circle r={radius * 0.68} fill="#5c4837" />
            {[0, 60, 120].map((angle) => (
              <rect key={angle} x={-radius * 0.72} y="-5" width={radius * 1.44} height="10" fill={color} transform={`rotate(${angle})`} />
            ))}
            <circle r={radius * 0.2} fill={color} />
          </g>
          <circle r="7" fill="#a4532f" stroke="#ecd7a8" strokeWidth="2.5" />
        </g>
      ))}
      {JEWELS.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill="#a4532f" stroke="#ecd7a8" strokeWidth="2" />
      ))}
    </svg>
  )
}
