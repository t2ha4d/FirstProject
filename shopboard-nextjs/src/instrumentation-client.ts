import { ApiError } from './shared/api/client'

// Next.js logs every error that an error boundary catches. A failed API request is an expected
// state that the page already shows with "Try again", so it must not appear in the Console.
// Only calls that carry an ApiError are dropped; every other error is logged as usual.
const logError = console.error.bind(console)

console.error = (...args: unknown[]) => {
  if (!args.some((arg) => arg instanceof ApiError)) logError(...args)
}
