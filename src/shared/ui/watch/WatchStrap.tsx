import type { StrapStyle } from '../../types'

export interface WatchStrapProps {
  color: string
  strapStyle: StrapStyle
}

const STRAP_TOP = 'M67 112 L72 6 Q100 0 128 6 L133 112 Z'
const STRAP_BOTTOM = 'M67 228 L72 334 Q100 340 128 334 L133 228 Z'
const LINK_ROWS = Array.from({ length: 13 }, (_, i) => i * 8 + 8).flatMap((y) => [y, 340 - y])

/** Strap above and below the case: stitched leather, or steel / mesh links. */
export function WatchStrap({ color, strapStyle }: WatchStrapProps) {
  return (
    <g>
      {[STRAP_TOP, STRAP_BOTTOM].map((path) => (
        <path key={path} d={path} fill={color} />
      ))}
      {strapStyle === 'leather' &&
        [76, 124].map((x) => (
          <line
            key={x}
            x1={x}
            x2={x}
            y1="12"
            y2="328"
            stroke="#fff"
            strokeOpacity="0.35"
            strokeWidth="1"
            strokeDasharray="5 4"
          />
        ))}
      {strapStyle !== 'leather' &&
        LINK_ROWS.map((y) => (
          <line
            key={y}
            x1="68"
            x2="132"
            y1={y}
            y2={y}
            stroke="#000"
            strokeOpacity={strapStyle === 'steel' ? 0.28 : 0.12}
            strokeWidth="1"
          />
        ))}
    </g>
  )
}
