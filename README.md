# programming

Solutions to pure-logic programming challenges from LeetCode, Exercism and GreatFrontEnd, written in TypeScript and tested with Bun.

## Setup

```bash
bun install
```

## Workflow

```bash
# 1. Scaffold a challenge (platform: leetcode | exercism | greatfrontend)
bun new leetcode "1. Two Sum" https://leetcode.com/problems/two-sum/

# 2. Paste the statement into README.md, write tests, solve in solution.ts

# 3. Run tests for that challenge (or all of them)
bun test src/leetcode/0001-two-sum
bun test --watch src/leetcode/0001-two-sum
bun test

# Type-check and lint/format
bun run typecheck
bun run format:fix
```

## Structure

```
src/
  leetcode/
    0001-two-sum/
      README.md          # problem statement, link, notes, complexity
      solution.ts        # exported solution function(s)
      solution.test.ts   # bun:test cases
  exercism/
    hamming/...
  greatfrontend/
    debounce/...
scripts/
  new.ts                 # challenge scaffolder
```

- LeetCode folders are prefixed with the zero-padded problem number so they sort in order.
- Only pure logic exercises (algorithms, data structures, JS utility functions) — no UI/DOM/React.
