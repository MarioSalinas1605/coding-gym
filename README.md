# coding-gym

Solutions to programming challenges from LeetCode, Exercism and GreatFrontEnd, written in JavaScript (TypeScript optional) and tested with Bun: pure-logic exercises, plus GreatFrontEnd user-interface questions as small React apps.

## Requirements

- [Bun](https://bun.sh) 1.3+ — or [Devbox](https://www.jetify.com/devbox), which provides it via `devbox shell`

## Setup

```bash
bun install
```

## Workflow

```bash
# 1. Scaffold a challenge: asks for the URL, name and language; the problem
#    description is fetched from the URL (or copied in the browser with ⌘C)
bun new

# 2. Write tests, solve in solution.js (App.tsx for UI questions)

# 3. Run tests for that challenge (or all of them, UI ones included)
bun test src/leetcode/0001-two-sum
bun test --watch src/leetcode/0001-two-sum
bun test

# UI questions: open the app in the browser (hot reload)
cd src/greatfrontend/todo-list && bun dev

# Type-check (TS solutions) and lint/format
bun run typecheck
bun run format:fix
```

## Structure

```
src/
  leetcode/
    0001-two-sum/
      README.md          # problem statement, link, notes, complexity
      solution.js        # exported solution function(s) (.ts with --ts)
      solution.test.js   # bun:test cases (.ts with --ts)
  exercism/
    hamming/...
  greatfrontend/
    debounce/...
    todo-list/           # UI question: a self-contained React project
      README.md
      package.json       # bun dev / bun test / bun run typecheck
      tsconfig.json
      bunfig.toml        # preloads happydom.ts for `bun test` in this folder
      happydom.ts        # DOM for the component tests
      index.html         # dev server entry -> main.tsx
      main.tsx
      App.tsx            # the solution component
      App.test.tsx       # React Testing Library + user-event tests
scripts/
  new.ts                 # challenge scaffolder
  description.ts         # problem description (fetched from the URL or copied) -> Markdown
  happydom.ts            # DOM preloaded by root `bun test` (bunfig.toml), for UI tests
  templates/react-ts/    # UI project templates copied by `bun new` (react-js/ too)
```

- LeetCode folders are prefixed with the zero-padded problem number so they sort in order.
- Logic exercises (algorithms, data structures, JS utility functions) stay dependency-free.
- GreatFrontEnd UI questions (detected from a `/questions/user-interface/` URL) are React projects and [Bun workspaces](https://bun.sh/docs/install/workspaces) of the root: their dependencies install with the root `bun install`, and root `bun test` runs their tests (happy-dom is preloaded for every run; logic tests ignore it).
