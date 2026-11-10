#!/usr/bin/env node
// Fails if any TypeScript file uses `as const`.
// oxlint's typescript/consistent-type-assertions ("never") blocks `x as T` and `<T>x`
// but allows const assertions, so this check covers the gap. Comments are ignored,
// and import/export renames (`import { a as b }`, `export * as ns`) never match.
// Usage: node scripts/check-no-as-const.mjs [files...]   (default: every file in src/)
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const AS_CONST = /\bas\s+const\b/

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

function stripComments(line, state) {
  let code = ''
  for (let i = 0; i < line.length; i++) {
    if (state.inBlock) {
      if (line.startsWith('*/', i)) {
        state.inBlock = false
        i++
      }
    } else if (line.startsWith('/*', i)) {
      state.inBlock = true
      i++
    } else if (line.startsWith('//', i)) {
      break
    } else {
      code += line[i]
    }
  }
  return code
}

const args = process.argv.slice(2)
const files = (args.length > 0 ? args : walk('src')).filter((file) => /\.(ts|tsx)$/.test(file))

const hits = files.flatMap((file) => {
  const state = { inBlock: false }
  return readFileSync(file, 'utf8')
    .split('\n')
    .flatMap((line, index) =>
      AS_CONST.test(stripComments(line, state)) ? [`${file}:${index + 1}: ${line.trim()}`] : [],
    )
})

if (hits.length > 0) {
  console.error('`as const` is not allowed (see CLAUDE.md). Found:')
  for (const hit of hits) console.error(`  ${hit}`)
  process.exit(1)
}
