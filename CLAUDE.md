# FirstProject

This repo holds two separate projects side by side:

- `shopboard-vanilla/`: vanilla JS ShopBoard (tasks 1 and 2).
- `shopboard-nextjs/`: ShopBoard on Next.js (the React app from tasks 4 and 5, converted for task 6). In the tags `task-4-react` and `task-5-multipage` this folder is still named `shopboard-react/`.

Each project has its own `package.json` and `CLAUDE.md`. Work inside one folder at a time, and treat that folder's `CLAUDE.md` as the rulebook for it.

The root only holds repo setup: husky (`.husky/pre-commit`), `.gitignore`, `.gitattributes` and this documentation. The pre-commit hook runs the checks of whichever project has staged files. Do not put application code at the root.
