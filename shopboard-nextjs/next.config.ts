import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // CLAUDE.md is this project's rulebook; Next.js must not generate an AGENTS.md next to it.
  agentRules: false,
  // The repository root has its own lockfile (for husky), so name this folder as the project root.
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
}

export default nextConfig
