# coding-gym

Solutions to pure-logic programming challenges from LeetCode, Exercism and GreatFrontEnd, written in JavaScript (TypeScript optional) and tested with Bun.

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

# 2. Write tests, solve in solution.js

# 3. Run tests for that challenge (or all of them)
bun test src/leetcode/0001-two-sum
bun test --watch src/leetcode/0001-two-sum
bun test

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
scripts/
  new.ts                 # challenge scaffolder
  description.ts         # problem description (fetched from the URL or copied) -> Markdown
```

- LeetCode folders are prefixed with the zero-padded problem number so they sort in order.
- Only pure logic exercises (algorithms, data structures, JS utility functions) — no UI/DOM/React.
