import type { ReactNode } from 'react'

export type IconName =
  | 'search'
  | 'bag'
  | 'heart'
  | 'heart-filled'
  | 'close'
  | 'arrow'
  | 'crown'
  | 'wave'
  | 'stopwatch'
  | 'compass'
  | 'plane'
  | 'circle'
  | 'hand'
  | 'gem'
  | 'alert'
  | 'box'

export interface IconProps {
  name: IconName
  size?: number
}

const HEART =
  'M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.2 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z'

const PATHS: Record<IconName, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8h14l1 12H4L5 8Z" />
      <path d="M9 11V6a3 3 0 0 1 6 0v5" />
    </>
  ),
  heart: <path d={HEART} />,
  'heart-filled': <path fill="currentColor" d={HEART} />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  arrow: <path d="M4 12h15m-5-5 5 5-5 5" />,
  crown: <path d="M4 18h16M5 15 3.5 7 9 11l3-6 3 6 5.5-4L19 15H5Z" />,
  wave: <path d="M3 9c3-3 6-3 9 0s6 3 9 0M3 15c3-3 6-3 9 0s6 3 9 0" />,
  stopwatch: (
    <>
      <circle cx="12" cy="14" r="7" />
      <path d="M12 14V10M10 3h4M12 3v4M18 7l1.5 1.5" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  plane: <path d="M21 4 3 11l6 2.5L11.5 20 21 4Zm0 0L9 13.5" />,
  circle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  hand: (
    <path d="M8 12V6a1.5 1.5 0 0 1 3 0v5m0-1V4.5a1.5 1.5 0 0 1 3 0V11m0-4a1.5 1.5 0 0 1 3 0v6c0 4-2.5 7-6 7-3 0-4.5-1.5-6-4l-2-3.5c-.8-1.5 1.3-2.8 2.3-1.500L8 14" />
  ),
  gem: <path d="M7 4h10l4 6-9 11L3 10l4-6Zm-4 6h18M9 10l3 11 3-11-3-6-3 6Z" />,
  alert: (
    <>
      <path d="M12 4 2.5 20h19L12 4Z" />
      <path d="M12 10v5m0 2.5v.5" />
    </>
  ),
  box: (
    <>
      <path d="m3 8 9-5 9 5v8l-9 5-9-5V8Z" />
      <path d="m3 8 9 5 9-5M12 13v8" />
    </>
  ),
}

export function Icon({ name, size = 22 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}
