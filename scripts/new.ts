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
 *
 * GreatFrontEnd user-interface questions become a React workspace project
 * copied from scripts/templates/react-{ts,js} (detected from the URL, or asked
 * without one); everything else gets a solution file and its tests.
 */

import * as p from "@clack/prompts";
import rootPackage from "../package.json";
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

const KIND_LABELS: Record<Kind, string> = {
	logic: "Logic (JS function)",
	ui: "UI (React)",
};

const NAME_EXAMPLES: Record<Platform, string> = {
	leetcode: "1. Two Sum",
	exercism: "Hamming",
	greatfrontend: "Debounce",
};

/** logic: a solution function; ui: a React app (GreatFrontEnd only) */
type Kind = "logic" | "ui";

type Challenge = {
	platform: Platform;
	kind: Kind;
	name: string;
	url: string;
	ts: boolean;
	problem: string | undefined;
};

const ROOT = `${import.meta.dir}/..`;
const TEMPLATES = `${import.meta.dir}/templates`;

// Installed with `bun add` so each project starts on the current versions
const UI_DEPS = ["react", "react-dom"];
const UI_DEV_DEPS = [
	"@types/react",
	"@types/react-dom",
	"@types/bun",
	"@testing-library/react",
	"@testing-library/dom",
	"@testing-library/user-event",
	"@happy-dom/global-registrator",
];
// …except TypeScript, kept on the root's range so every project type-checks
// with the same major version
const TYPESCRIPT = `typescript@${rootPackage.peerDependencies.typescript}`;

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
	const files = ["solution.js", "solution.ts", "package.json"];
	for (const file of files) {
		if (await Bun.file(`${dir}/${file}`).exists()) return true;
	}
	return false;
}

function platformFromUrl(url: string): Platform | undefined {
	const host = URL.parse(url)?.hostname ?? "";
	return PLATFORMS.find((platform) => host.includes(platform));
}

// https://www.greatfrontend.com/questions/user-interface/todo-list (also under
// /interviews/study/<plan>/questions/...) vs /questions/javascript/debounce
function kindFromUrl(url: string): Kind {
	const path = URL.parse(url)?.pathname ?? "";
	return path.includes("/questions/user-interface/") ? "ui" : "logic";
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
		if (platform === "greatfrontend") {
			p.log.step(`Type: ${KIND_LABELS[kindFromUrl(url)]}`);
		}
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

	// Only GreatFrontEnd has UI questions: read it from the URL or ask
	const kind: Kind =
		platform !== "greatfrontend"
			? "logic"
			: url
				? kindFromUrl(url)
				: answer(
						await p.select({
							message: "Type",
							options: (["logic", "ui"] as const).map((value) => ({
								value,
								label: KIND_LABELS[value],
							})),
						}),
					);

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
	return { platform, kind, name, url, ts: lang === "ts", problem };
}

async function create({ platform, kind, name, url, ts, problem }: Challenge) {
	const slug = slugFor(name);
	const { title } = parseName(name);
	const path = `src/${platform}/${slug}`;
	const dir = `${ROOT}/${path}`;

	const notes =
		kind === "ui"
			? `## Run

\`\`\`bash
bun test ${path}   # from the repo root, or \`bun test\` in this folder
cd ${path} && bun dev   # open the printed URL
\`\`\`

## Notes

<!-- Approach, UX improvements, things learned -->
`
			: `## Notes

<!-- Approach, complexity, things learned -->

- Time:
- Space:
`;

	await Bun.write(
		`${dir}/README.md`,
		`# ${name}

${url ? `${url}\n\n` : ""}## Problem

${problem ?? "<!-- Paste the problem statement here -->"}

${notes}`,
	);

	if (kind === "ui") await createUi(dir, slug, title, ts);
	else await createLogic(dir, title, ts);

	return path;
}

async function createLogic(dir: string, title: string, ts: boolean) {
	const ext = ts ? "ts" : "js";
	const fnName = fnNameFor(title);

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
}

/**
 * A self-contained React project (its own package.json, tsconfig, entry
 * point and tests). It's a workspace of the root package.json, so its
 * dependencies install into the root and root `bun test` runs its tests.
 */
async function createUi(dir: string, slug: string, title: string, ts: boolean) {
	const template = `${TEMPLATES}/react-${ts ? "ts" : "js"}`;
	const fill = (text: string) =>
		text.replaceAll("{{name}}", slug).replaceAll("{{title}}", title);

	for await (const file of new Bun.Glob("**/*").scan({
		cwd: template,
		dot: true,
	})) {
		await Bun.write(
			`${dir}/${file}`,
			fill(await Bun.file(`${template}/${file}`).text()),
		);
	}

	const spinner = p.spinner();
	spinner.start("Installing React and Testing Library");
	const failed =
		(await bunAdd(dir, UI_DEPS)) ??
		(await bunAdd(dir, ["-d", ...UI_DEV_DEPS, ...(ts ? [TYPESCRIPT] : [])]));
	if (failed) {
		spinner.error("Couldn't install the dependencies");
		p.log.warn(
			`${failed.trim()}\nInstall them from the challenge folder:\n  bun add ${UI_DEPS.join(" ")}\n  bun add -d ${UI_DEV_DEPS.join(" ")}${ts ? ` ${TYPESCRIPT}` : ""}`,
		);
	} else {
		spinner.stop("Installed React and Testing Library");
	}
}

/** `bun add` in `cwd`; returns its output if it failed. */
async function bunAdd(
	cwd: string,
	args: string[],
): Promise<string | undefined> {
	const proc = Bun.spawn([process.execPath, "add", ...args], {
		cwd,
		stdout: "pipe",
		stderr: "pipe",
	});
	const [code, stderr] = await Promise.all([
		proc.exited,
		new Response(proc.stderr).text(),
	]);
	return code === 0 ? undefined : stderr || `bun add exited with ${code}`;
}

if (!process.stdin.isTTY) {
	console.error("bun new is interactive: run it in a terminal.");
	process.exit(1);
}

const challenge = await ask();
const path = await create(challenge);
p.outro(
	`Created ${path}/${challenge.problem ? "" : " (paste the description into README.md later)"}\n` +
		`   Next: bun test --watch ${path}` +
		(challenge.kind === "ui" ? `\n         cd ${path} && bun dev` : ""),
);
