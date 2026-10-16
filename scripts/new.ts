/**
 * Scaffold a new challenge.
 *
 * Usage:
 *   bun new
 *
 * Asks for the URL, platform, name, language and problem description. With a
 * URL, the platform is detected and the description (plus LeetCode's number
 * and title) is fetched; otherwise it's read from what the user copies in the
 * browser (see scripts/description.ts).
 */

import * as p from "@clack/prompts";
import {
	copiedDescription,
	type FetchedProblem,
	fetchProblem,
} from "./description";

const PLATFORMS = ["leetcode", "exercism", "greatfrontend"] as const;
type Platform = (typeof PLATFORMS)[number];

const PLATFORM_LABELS: Record<Platform, string> = {
	leetcode: "LeetCode",
	exercism: "Exercism",
	greatfrontend: "GreatFrontEnd",
};

const NAME_EXAMPLES: Record<Platform, string> = {
	leetcode: "1. Two Sum",
	exercism: "Hamming",
	greatfrontend: "Debounce",
};

type Challenge = {
	platform: Platform;
	name: string;
	url: string;
	ts: boolean;
	problem: string | undefined;
};

const ROOT = `${import.meta.dir}/..`;

const slugify = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

/** "1. Two Sum" -> number "1", title "Two Sum"; "Hamming" -> title "Hamming" */
function parseName(name: string): { number?: string; title: string } {
	const numbered = name.match(/^(\d+)\.?\s*(.*)$/);
	return numbered
		? { number: numbered[1], title: numbered[2] ?? name }
		: { title: name };
}

// "1. Two Sum" -> "0001-two-sum"; "Hamming" -> "hamming"
function slugFor(name: string): string {
	const { number, title } = parseName(name);
	return number
		? `${number.padStart(4, "0")}-${slugify(title)}`
		: slugify(name);
}

// camelCase function name from the title, without the number
function fnNameFor(title: string): string {
	return (
		title
			.replace(/[^a-zA-Z0-9]+(.)?/g, (_, c: string | undefined) =>
				c ? c.toUpperCase() : "",
			)
			.replace(/^./, (c) => c.toLowerCase())
			.replace(/^(\d)/, "_$1") || "solution"
	);
}

async function exists(platform: Platform, slug: string): Promise<boolean> {
	const dir = `${ROOT}/src/${platform}/${slug}`;
	return (
		(await Bun.file(`${dir}/solution.js`).exists()) ||
		(await Bun.file(`${dir}/solution.ts`).exists())
	);
}

function platformFromUrl(url: string): Platform | undefined {
	const host = URL.parse(url)?.hostname ?? "";
	return PLATFORMS.find((platform) => host.includes(platform));
}

/** Title suggested by the URL's last path segment: ".../two-sum/" -> "Two Sum" */
function titleFromUrl(url: string): string | undefined {
	const segment = URL.parse(url)?.pathname.split("/").filter(Boolean).at(-1);
	return segment
		?.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

/** First prose line of the converted statement, for a one-line preview. */
function preview(markdown: string): string {
	const line =
		markdown
			.split("\n")
			.find((l) => l.trim() && !l.startsWith("#") && !l.startsWith("```")) ??
		"";
	const plain = line.replace(/[`*_]/g, "").trim();
	return plain.length > 70 ? `${plain.slice(0, 69)}…` : plain;
}

/** Unwrap a prompt result, exiting cleanly on Ctrl+C / Esc. */
function answer<T>(value: T): Exclude<T, symbol> {
	if (p.isCancel(value)) {
		p.cancel("Cancelled, nothing was created.");
		process.exit(0);
	}
	return value as Exclude<T, symbol>;
}

async function askProblem(platform: Platform): Promise<string | undefined> {
	while (true) {
		const action = answer(
			await p.select({
				message: "Problem description",
				options: [
					{
						value: "read",
						label: "Read it from the clipboard",
						hint: "copy it in the browser first",
					},
					{ value: "type", label: "Type or paste it here" },
					{
						value: "skip",
						label: "Skip",
						hint: "paste it into README.md later",
					},
				],
			}),
		);
		if (action === "skip") return undefined;
		if (action === "type") {
			const typed = answer(
				await p.multiline({
					message: "Description (Tab to the submit button when done)",
					// with a submit button, Enter adds a line instead of submitting
					showSubmit: true,
					validate: (v) => (v?.trim() ? undefined : "Enter a description"),
				}),
			).trim();
			return typed;
		}

		const description = copiedDescription(platform);
		if (!description) {
			p.log.warn(
				"No copied web page on the clipboard. Select the description in the browser and press ⌘C.",
			);
			continue;
		}
		p.log.info(`Got: "${preview(description)}"`);
		if (answer(await p.confirm({ message: "Use this description?" }))) {
			return description;
		}
	}
}

async function ask(): Promise<Challenge> {
	p.intro("New challenge");

	const url = answer(
		await p.text({
			message: "Problem URL (optional)",
			placeholder: "https://leetcode.com/problems/two-sum/",
			validate: (v) =>
				v && !URL.canParse(v) ? "That isn't a valid URL" : undefined,
		}),
	).trim();

	const detected = url ? platformFromUrl(url) : undefined;
	let platform: Platform;
	let fetched: FetchedProblem | undefined;
	if (detected) {
		platform = detected;
		p.log.step(`Platform: ${PLATFORM_LABELS[platform]}`);
		const spinner = p.spinner();
		spinner.start("Fetching the problem description");
		fetched = await fetchProblem(url, platform);
		if (fetched) spinner.stop(`Fetched: "${preview(fetched.description)}"`);
		else spinner.error("Couldn't fetch the description, enter it below");
	} else {
		platform = answer(
			await p.select({
				message: "Platform",
				options: PLATFORMS.map((value) => ({
					value,
					label: PLATFORM_LABELS[value],
				})),
			}),
		);
	}

	// LeetCode URLs don't carry the problem number: use the fetched one or ask
	const number =
		platform === "leetcode"
			? (fetched?.number ??
				answer(
					await p.text({
						message: "Problem number",
						placeholder: "1",
						validate: (v) =>
							/^\s*\d+\s*$/.test(v ?? "") ? undefined : "Enter a number",
					}),
				).trim())
			: undefined;

	const title = answer(
		await p.text({
			message: "Name",
			placeholder: parseName(NAME_EXAMPLES[platform]).title,
			initialValue: fetched?.title ?? (url ? titleFromUrl(url) : undefined),
			validate: (v) => (slugify(v ?? "") ? undefined : "Enter a name"),
		}),
	).trim();
	const name = number ? `${Number(number)}. ${title}` : title;

	const slug = slugFor(name);
	if (await exists(platform, slug)) {
		p.cancel(`Already exists: src/${platform}/${slug}`);
		process.exit(1);
	}

	const lang = answer(
		await p.select({
			message: "Language",
			options: [
				{ value: "js", label: "JavaScript" },
				{ value: "ts", label: "TypeScript" },
			],
		}),
	);

	const problem = fetched?.description ?? (await askProblem(platform));
	return { platform, name, url, ts: lang === "ts", problem };
}

async function create({ platform, name, url, ts, problem }: Challenge) {
	const ext = ts ? "ts" : "js";
	const slug = slugFor(name);
	const { title } = parseName(name);
	const fnName = fnNameFor(title);
	const dir = `${ROOT}/src/${platform}/${slug}`;

	await Bun.write(
		`${dir}/README.md`,
		`# ${name}

${url ? `${url}\n\n` : ""}## Problem

${problem ?? "<!-- Paste the problem statement here -->"}

## Notes

<!-- Approach, complexity, things learned -->

- Time:
- Space:
`,
	);

	await Bun.write(
		`${dir}/solution.${ext}`,
		`export function ${fnName}()${ts ? ": unknown" : ""} {
	// TODO
	return undefined;
}
`,
	);

	await Bun.write(
		`${dir}/solution.test.${ext}`,
		`import { describe, expect, test } from "bun:test";
import { ${fnName} } from "./solution";

describe("${title.replace(/"/g, '\\"')}", () => {
	test.todo("example 1", () => {
		expect(${fnName}()).toEqual(undefined);
	});
});
`,
	);

	return `src/${platform}/${slug}`;
}

if (!process.stdin.isTTY) {
	console.error("bun new is interactive: run it in a terminal.");
	process.exit(1);
}

const challenge = await ask();
const path = await create(challenge);
p.outro(
	`Created ${path}/${challenge.problem ? "" : " (paste the description into README.md later)"}\n` +
		`   Next: bun test --watch ${path}`,
);
