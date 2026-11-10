export interface SprigProps {
  className?: string
}

const LEAVES = [
  { x: 98, y: 188, angle: -55 },
  { x: 118, y: 168, angle: 52 },
  { x: 92, y: 148, angle: -62 },
  { x: 122, y: 128, angle: 48 },
  { x: 96, y: 108, angle: -58 },
  { x: 124, y: 88, angle: 42 },
  { x: 106, y: 68, angle: -48 },
  { x: 128, y: 50, angle: 28 },
  { x: 118, y: 34, angle: -18 },
]

/** Decorative olive branch echoing the brand's natural palette. */
export function Sprig({ className }: SprigProps) {
  return (
    <svg className={className} viewBox="0 0 220 240" aria-hidden="true" focusable="false">
      <path d="M92 236C100 170 108 100 124 24" stroke="#5b5f45" strokeWidth="2.5" fill="none" />
      {LEAVES.map(({ x, y, angle }) => (
        <ellipse
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          rx="9"
          ry="24"
          fill="#6e7358"
          transform={`rotate(${angle} ${x} ${y})`}
        />
      ))}
    </svg>
  )
}
