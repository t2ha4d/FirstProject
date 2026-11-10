/** Narrows a value to one of `options` without a type assertion. */
export function isOneOf<T extends string>(value: unknown, options: readonly T[]): value is T {
  return options.some((option) => option === value)
}
