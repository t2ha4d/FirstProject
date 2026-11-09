/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for the API client, e.g. "/api" or "https://api.example.com". Defaults to "/api". */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
