# coding-gym

This repo holds solutions to **pure-logic** programming challenges from LeetCode, Exercism and GreatFrontEnd (algorithms, data structures, JS utility functions — no UI, DOM, React or CSS).

## Layout

- `src/<platform>/<slug>/` — one folder per challenge, `platform` ∈ `leetcode | exercism | greatfrontend`
  - `README.md` — link, problem statement, notes, time/space complexity
  - `solution.js` — exported solution function(s)
  - `solution.test.js` — `bun:test` cases
- Solutions are **JavaScript by default**; TypeScript is opt-in per challenge (`solution.ts` / `solution.test.ts`).
- LeetCode slugs are zero-padded with the problem number: `0001-two-sum`. Others are kebab-case: `hamming`, `debounce`.
- New challenges are scaffolded with `bun new`, an interactive prompt (see `scripts/new.ts`). It needs a terminal, so ask the user to run it rather than running it yourself or hand-creating the folder.

## Working on challenges

- The user is practicing. When they ask for help, hints or a review on an exercise, use the `tutor` skill and don't write the solution for them unless they explicitly ask.
- Match the challenge's language: don't convert a JS solution to TS (or vice versa) unless asked.
- TS solutions use strict mode and `noUncheckedIndexedAccess` — handle `undefined` from index access explicitly. JS files aren't type-checked.
- Keep solutions dependency-free (standard library only), as on the platforms.
- Run a single challenge's tests with `bun test src/<platform>/<slug>`.
- Lint/format with Biome: `bun run format:fix`. Type-check TS solutions with `bun run typecheck`.

## Commits

[Conventional Commits](https://www.conventionalcommits.org) with the platform as scope, one challenge per commit. Use the `/commit` skill, which holds the full rules.

## Tooling

Default to Bun instead of Node.js.

- `bun <file>` instead of `node`/`ts-node`
- `bun test` instead of `jest`/`vitest`
- `bun install` / `bun run <script>` / `bunx <pkg>` instead of npm/yarn/pnpm/npx
- Prefer `Bun.file` / `Bun.write` over `node:fs`

```js#solution.test.js
import { describe, expect, test } from "bun:test";
import { twoSum } from "./solution";

describe("Two Sum", () => {
	test("example 1", () => {
		expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
	});
});
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.mdx`.
