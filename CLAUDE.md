# FirstProject

This repo holds two separate projects side by side:

- `shopboard-vanilla/`: vanilla JS ShopBoard (tasks 1 and 2).
- `shopboard-react/`: React ShopBoard (task 4 and the task 5 multi-page app).

Each project has its own `package.json` and `CLAUDE.md`. Work inside one folder at a time, and treat that folder's `CLAUDE.md` as the rulebook for it.

The root only holds repo setup: husky (`.husky/pre-commit`), `.gitignore`, `.gitattributes` and this documentation. The pre-commit hook runs the checks of whichever project has staged files. Do not put application code at the root.
