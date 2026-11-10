import type { ZodType } from 'zod'

const DEFAULT_API_BASE_URL = 'https://shopboard-api.vercel.app/api'

/** Base URL for every request, from VITE_API_BASE_URL without a trailing slash. */
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, '')

export class ApiError extends Error {
  readonly status: number | null

  constructor(message: string, status: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Builds the full URL for an endpoint path such as "/products". */
function buildApiUrl(path: string): string {
  return `${API_BASE_URL}/${path.replace(/^\/+/, '')}`
}

/**
 * GETs an endpoint and validates the JSON body against `schema`, returning typed
 * data or throwing an ApiError. Every feature goes through this function.
 */
export async function apiGet<T>(path: string, schema: ZodType<T>): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new ApiError(
      `Request to ${path} failed: ${response.status} ${response.statusText}`,
      response.status,
    )
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new ApiError(`Response from ${path} is not valid JSON`, response.status)
  }

  const result = schema.safeParse(data)
  if (!result.success) {
    throw new ApiError(`Response from ${path} has an unexpected shape`, response.status)
  }
  return result.data
}
