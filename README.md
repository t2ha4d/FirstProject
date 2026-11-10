# FirstProject

Two course projects in one repository. Both keep their full commit history.

| Task | Folder | Tag |
| ---- | ------ | --- |
| 1 and 2 (vanilla JS) | `shopboard-vanilla/` | `task-2-vanilla` |
| 4 (React) | `shopboard-react/` in the tag (now `shopboard-nextjs/`) | `task-4-react` |
| 5 (multi-page React app) | `shopboard-react/` in the tag (now `shopboard-nextjs/`) | `task-5-multipage` |

Check out a tag to see a project as it was at that task, for example `git checkout task-4-react`.

## Install and run

Run `npm install` in the repo root once. It installs husky and sets up the git hook.

Then, for each project:

```
cd shopboard-vanilla   # or shopboard-nextjs
npm install
npm run dev
```

Other scripts in both projects: `npm run build`, `npm run lint`, `npm run format:check`.
`shopboard-nextjs` also has `npm run typecheck`.

## Git hook

A single `.husky/pre-commit` at the root checks only the project whose files are staged:

- `shopboard-vanilla`: `lint-staged` (eslint and prettier on staged files).
- `shopboard-nextjs`: `typecheck`, `lint`, `format:check` and `build`.
