/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for the API client, e.g. "https://shopboard-api.vercel.app/api" (the default). */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
