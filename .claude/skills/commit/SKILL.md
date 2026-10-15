---
name: commit
description: Create a Conventional Commit for the current changes in this challenges repo. Use when the user asks to commit, or invokes /commit.
argument-hint: "[optional: extra context for the message]"
---

# Commit

Create a commit using [Conventional Commits](https://www.conventionalcommits.org): `<type>(<scope>): <subject>`. This skill is the source of truth for the repo's commit conventions.

## Examples

```
feat(leetcode): solve 0001 two-sum
refactor(leetcode): 0001 two-sum O(n²) → O(n) with hash map
test(exercism): add edge cases for hamming
docs(greatfrontend): add complexity notes for debounce
chore: add typecheck script
```

## Steps

1. Run `git status --short` and `git diff HEAD` (or `git diff --cached` if the user already staged files). If nothing changed, say so and stop.
2. Group the changes. One commit per challenge is the rule: if the diff touches several challenges, or mixes a challenge with tooling, propose separate commits and ask before splitting.
3. Pick the message:
   - **Scope** = the platform folder under `src/` (`leetcode`, `exercism`, `greatfrontend`). Omit it for repo-wide/tooling changes.
   - **Type**: new challenge folder → `feat`; changed `solution.ts` of an existing challenge → `refactor` (or `fix` if tests were failing / the solution was wrong); only `*.test.ts` → `test`; only `README.md` notes → `docs`; anything outside `src/` → `chore` (tooling, config, scripts).
   - **Subject**: imperative, lowercase, no trailing period, ≤ 72 chars, naming the challenge slug (e.g. `solve 0001 two-sum`).
   - Add a short body only when it adds something (approach, complexity change).
4. Before committing a solution, run `bun test <challenge dir>` and report the result. Don't block on failing tests if the user wants to commit work in progress, but mention it.
5. Show the proposed message, then stage the relevant files explicitly (no `git add -A`) and commit. End the message with the attribution trailer required by the session, if any.
