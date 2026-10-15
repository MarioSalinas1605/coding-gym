/**
 * Scaffold a new challenge.
 *
 * Usage:
 *   bun new <platform> <name> [url]
 *
 * Examples:
 *   bun new leetcode "1. Two Sum" https://leetcode.com/problems/two-sum/
 *   bun new exercism "Hamming"
 *   bun new greatfrontend "Debounce"
 */

const PLATFORMS = ["leetcode", "exercism", "greatfrontend"] as const;
type Platform = (typeof PLATFORMS)[number];

const [platform, name, url = ""] = Bun.argv.slice(2);

if (!platform || !name || !PLATFORMS.includes(platform as Platform)) {
	console.error(
		`Usage: bun new <${PLATFORMS.join("|")}> <name> [url]\n` +
			'Example: bun new leetcode "1. Two Sum" https://leetcode.com/problems/two-sum/',
	);
	process.exit(1);
}

// "1. Two Sum" -> "0001-two-sum"; "Hamming" -> "hamming"
const numbered = name.match(/^(\d+)\.?\s*(.*)$/);
const slugify = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
const slug = numbered
	? `${numbered[1]?.padStart(4, "0")}-${slugify(numbered[2] ?? "")}`
	: slugify(name);

// camelCase function name from the title, without the number
const title = numbered ? (numbered[2] ?? name) : name;
const fnName =
	title
		.replace(/[^a-zA-Z0-9]+(.)?/g, (_, c: string | undefined) =>
			c ? c.toUpperCase() : "",
		)
		.replace(/^./, (c) => c.toLowerCase())
		.replace(/^(\d)/, "_$1") || "solution";

const dir = `${import.meta.dir}/../src/${platform}/${slug}`;

if (await Bun.file(`${dir}/solution.ts`).exists()) {
	console.error(`Already exists: src/${platform}/${slug}`);
	process.exit(1);
}

await Bun.write(
	`${dir}/README.md`,
	`# ${name}

${url ? `${url}\n\n` : ""}## Problem

<!-- Paste the problem statement here -->

## Notes

<!-- Approach, complexity, things learned -->

- Time:
- Space:
`,
);

await Bun.write(
	`${dir}/solution.ts`,
	`export function ${fnName}(): unknown {
	// TODO
	return undefined;
}
`,
);

await Bun.write(
	`${dir}/solution.test.ts`,
	`import { describe, expect, test } from "bun:test";
import { ${fnName} } from "./solution";

describe("${title.replace(/"/g, '\\"')}", () => {
	test.todo("example 1", () => {
		expect(${fnName}()).toEqual(undefined);
	});
});
`,
);

console.log(`Created src/${platform}/${slug}/`);
console.log(`Run tests: bun test src/${platform}/${slug}`);
