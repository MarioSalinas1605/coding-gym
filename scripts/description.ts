/**
 * Get a problem description as Markdown: fetched from the problem URL, or read
 * from what the user copied in the browser.
 *
 * - LeetCode: public GraphQL API (also gives the problem number and title)
 * - Exercism: the track's .docs/*.md files on GitHub
 * - GreatFrontEnd: the question page's first "prose" block
 * - Clipboard: copying a web page puts its HTML on the clipboard (macOS)
 *
 * HTML is converted with turndown and normalized per platform to match the
 * README layout: the statement's headings nested under "## Problem", and
 * LeetCode's bold "Example 1:" / "Constraints:" / "Follow-up:" labels turned
 * into headings.
 */

import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

type Platform = "leetcode" | "exercism" | "greatfrontend";

// Fence language for <pre> blocks that don't declare one
const DEFAULT_LANG: Record<Platform, string> = {
	leetcode: "",
	exercism: "",
	greatfrontend: "js",
};

export type FetchedProblem = {
	description: string;
	number?: string;
	title?: string;
};

/** Fetch the problem from its URL, or undefined if that isn't possible. */
export async function fetchProblem(
	url: string,
	platform: Platform,
): Promise<FetchedProblem | undefined> {
	const segments = URL.parse(url)?.pathname.split("/").filter(Boolean) ?? [];
	try {
		if (platform === "leetcode") return await fetchLeetCode(segments);
		if (platform === "exercism") return await fetchExercism(segments);
		return await fetchGreatFrontEnd(url);
	} catch {
		return undefined; // network error, timeout, unexpected response
	}
}

const get = (url: string, init?: RequestInit) =>
	fetch(url, { signal: AbortSignal.timeout(10_000), ...init });

// https://leetcode.com/problems/two-sum/description/
async function fetchLeetCode(
	segments: string[],
): Promise<FetchedProblem | undefined> {
	const slug = segments[segments.indexOf("problems") + 1];
	if (!segments.includes("problems") || !slug) return undefined;

	const res = await get("https://leetcode.com/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Referer: `https://leetcode.com/problems/${slug}/`,
		},
		body: JSON.stringify({
			query:
				"query q($titleSlug: String!) { question(titleSlug: $titleSlug) { questionFrontendId title content } }",
			variables: { titleSlug: slug },
		}),
	});
	const question = (
		(await res.json()) as {
			data?: {
				question?: {
					questionFrontendId: string;
					title: string;
					content: string | null; // null for premium problems
				};
			};
		}
	).data?.question;
	if (!question?.content) return undefined;

	return {
		description: htmlToMarkdown(question.content, "leetcode"),
		number: question.questionFrontendId,
		title: question.title,
	};
}

// https://exercism.org/tracks/javascript/exercises/hamming
async function fetchExercism(
	segments: string[],
): Promise<FetchedProblem | undefined> {
	const track = segments[segments.indexOf("tracks") + 1];
	const slug = segments[segments.indexOf("exercises") + 1];
	if (!segments.includes("tracks") || !track || !slug) return undefined;

	const text = async (url: string) => {
		const res = await get(url);
		return res.ok ? await res.text() : undefined;
	};
	for (const kind of ["practice", "concept"]) {
		const docs = `https://raw.githubusercontent.com/exercism/${track}/main/exercises/${kind}/${slug}/.docs`;
		// The site shows these one after another; only instructions.md is required
		const instructions = await text(`${docs}/instructions.md`);
		if (!instructions) continue;
		const parts = await Promise.all([
			text(`${docs}/introduction.md`),
			instructions,
			text(`${docs}/instructions.append.md`),
		]);
		return {
			description: normalize(parts.filter(Boolean).join("\n\n"), "exercism"),
		};
	}
	return undefined;
}

// https://www.greatfrontend.com/questions/javascript/debounce
//
// GreatFrontEnd has no public API, so this scrapes the question page and
// depends on its markup (as of 2026-10). If it starts failing (falls back to
// copy-paste) or grabs the wrong text, check these assumptions on a saved page:
// - the description is server-rendered into the page's HTML
// - it's the first <div class="prose …"> (Tailwind typography)
// - code examples render one `.token-line` element per line (Prism), see the
//   "pre" rule in htmlToMarkdown; otherwise they lose their line breaks
async function fetchGreatFrontEnd(
	url: string,
): Promise<FetchedProblem | undefined> {
	const res = await get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
	if (!res.ok) return undefined;
	const html = firstElement(await res.text(), /<div class="prose[ "]/);
	return html
		? { description: htmlToMarkdown(html, "greatfrontend", url) }
		: undefined;
}

/** The outer HTML of the first <div> whose opening tag matches `start`. */
function firstElement(html: string, start: RegExp): string | undefined {
	const begin = html.search(start);
	if (begin < 0) return undefined;
	const tags = /<div[\s>]|<\/div>/g;
	tags.lastIndex = begin;
	let depth = 0;
	for (let m = tags.exec(html); m; m = tags.exec(html)) {
		depth += m[0] === "</div>" ? -1 : 1;
		if (depth === 0) return html.slice(begin, tags.lastIndex);
	}
	return undefined;
}

/** The copied description as Markdown, or undefined if the clipboard holds no web page. */
export function copiedDescription(platform: Platform): string | undefined {
	const html = readClipboardHtml();
	return html?.trim() ? htmlToMarkdown(html, platform) : undefined;
}

function readClipboardHtml(): string | undefined {
	const result = Bun.spawnSync([
		"osascript",
		"-e",
		"the clipboard as «class HTML»",
	]);
	const hex = result.stdout.toString().match(/«data HTML([0-9A-Fa-f]*)»/)?.[1];
	return result.success && hex
		? Buffer.from(hex, "hex").toString("utf8")
		: undefined;
}

function htmlToMarkdown(
	html: string,
	platform: Platform,
	pageUrl?: string,
): string {
	const origin = pageUrl ? URL.parse(pageUrl)?.origin : undefined;
	const prepared = html
		// site-relative links would break in the README
		.replace(/(href|src)="\/(?!\/)/g, origin ? `$1="${origin}/` : "$&")
		// keep exponents/indices readable inside `code` too: 10<sup>4</sup> -> 10^4
		.replace(/<sup>(.*?)<\/sup>/gi, "^$1")
		.replace(/<sub>(.*?)<\/sub>/gi, "_$1")
		// line breaks inside <pre> would be lost by textContent
		.replace(/<pre[\s\S]*?<\/pre>/gi, (pre) =>
			pre.replace(/<br\s*\/?>/gi, "\n"),
		)
		.replace(/&nbsp;| /g, " ");

	const td = new TurndownService({
		headingStyle: "atx",
		codeBlockStyle: "fenced",
		bulletListMarker: "-",
		emDelimiter: "_",
	});
	td.use(gfm);
	td.remove(["script", "style", "button", "svg"]);
	td.addRule("pre", {
		filter: "pre",
		replacement: (_content, el) => {
			const classes = `${el.className} ${el.querySelector("code")?.className ?? ""}`;
			const lang =
				classes.match(/language-(\w+)/)?.[1] ?? DEFAULT_LANG[platform];
			// Highlighters (Prism, Shiki) may render each line as its own element
			const lines = [...el.querySelectorAll(".token-line, .line")];
			const text = lines.length
				? lines.map((line) => line.textContent?.replace(/\n$/, "")).join("\n")
				: (el.textContent ?? "");
			const code = text.replace(/^\n+|\s+$/g, "");
			return `\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
		},
	});

	return normalize(td.turndown(prepared), platform);
}

/** Apply `fn` to each line outside fenced code blocks. */
function mapProse(md: string, fn: (line: string) => string): string {
	let inFence = false;
	return md
		.split("\n")
		.map((line) => {
			if (/^\s*```/.test(line)) inFence = !inFence;
			return inFence || /^\s*```/.test(line) ? line : fn(line);
		})
		.join("\n");
}

function normalize(md: string, platform: Platform): string {
	// Nest the statement's own headings under "## Problem": shallowest becomes ###
	const levels = [...md.matchAll(/^(#{1,6}) /gm)].map((m) => m[1]?.length ?? 6);
	const shift = levels.length ? 3 - Math.min(...levels) : 0;
	let out = mapProse(md, (line) =>
		line.replace(
			/^(#{1,6}) /,
			(_, h: string) => `${"#".repeat(Math.min(6, h.length + shift))} `,
		),
	);

	if (platform === "leetcode") {
		let seenExample = false;
		out = mapProse(out, (line) => {
			const example = line.match(/^\*\*Example (\d+):?\*\*\s*$/);
			if (example) {
				const heading = `#### Example ${example[1]}`;
				if (seenExample) return heading;
				seenExample = true;
				return `### Examples\n\n${heading}`;
			}
			return line
				.replace(/^\*\*Constraints:?\*\*\s*$/, "### Constraints")
				.replace(/^\*\*Follow[- ]?up:?\*\*:?\s*(.*)$/i, "### Follow-up\n\n$1")
				.replace(/^\*\*Note:?\*\*:?\s*(.*)$/, "### Note\n\n$1");
		});
	}

	// turndown pads list markers ("-   item"); tighten to "- item"
	out = mapProse(out, (line) => line.replace(/^(\s*)(-|\d+\.)\s{2,}/, "$1$2 "));

	return out
		.split("\n")
		.map((line) => line.trimEnd())
		.join("\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}
