/** Shared coordinates for the watch drawing (viewBox 0 0 200 340). */
export const CX = 100
export const CY = 170
export const HOUR_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30)

/** Point at `radius` from the dial centre, `angle` degrees clockwise from 12 o'clock. */
export function polar(angle: number, radius: number) {
  const radians = ((angle - 90) * Math.PI) / 180
  return { x: CX + radius * Math.cos(radians), y: CY + radius * Math.sin(radians) }
}

/** Dial radius: smaller when a bezel ring takes up the edge. */
export function dialRadiusFor(hasBezel: boolean): number {
  return hasBezel ? 56 : 66
}
