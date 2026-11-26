/**
 * Run every CI check (format, typecheck, test) in parallel.
 *
 * Usage:
 *   bun verify
 *
 * Output of passing checks is hidden. Each failing check's full output is
 * printed on its own, then a one-line-per-check summary. Exits with 1 if any
 * check failed. CI runs the same checks as separate steps.
 */

import { dim, green, red, useColor } from "./colors";

type Check = { name: string; cmd: string[] };
type CheckResult = {
	name: string;
	ok: boolean;
	output: string;
	seconds: number;
};

const CHECKS: Check[] = [
	{ name: "format", cmd: ["bun", "run", "--silent", "format"] },
	{ name: "typecheck", cmd: ["bun", "run", "--silent", "typecheck"] },
	{ name: "test", cmd: ["bun", "test", "--only-failures"] },
];

/** Runs one check to completion, capturing its output instead of streaming it. */
async function runCheck({ name, cmd }: Check): Promise<CheckResult> {
	const start = performance.now();
	const proc = Bun.spawn(cmd, {
		stdout: "pipe",
		stderr: "pipe",
		env: { ...process.env, FORCE_COLOR: useColor ? "1" : "0" },
	});
	const [stdout, stderr, exitCode] = await Promise.all([
		proc.stdout.text(),
		proc.stderr.text(),
		proc.exited,
	]);
	const seconds = (performance.now() - start) / 1000;
	return { name, ok: exitCode === 0, output: stdout + stderr, seconds };
}

/** Runs all checks at the same time; results keep the order of `checks`. */
function runChecks(checks: Check[]): Promise<CheckResult[]> {
	console.log(dim(`Running ${checks.map((c) => c.name).join(", ")}…`));
	return Promise.all(checks.map(runCheck));
}

/** Prints the full output of each failed check, one block per check. */
function printFailures(failed: CheckResult[]): void {
	for (const { name, output } of failed) {
		console.log(`\n${red(`── ✗ ${name} ──`)}\n${output.trimEnd()}`);
	}
}

/** Prints one ✓/✗ line per check with its duration, then the overall verdict. */
function printSummary(results: CheckResult[], failed: CheckResult[]): void {
	const width = Math.max(...results.map((r) => r.name.length));
	console.log();
	for (const { name, ok, seconds } of results) {
		const mark = ok ? green("✓") : red("✗");
		console.log(
			`${mark} ${name.padEnd(width)}  ${dim(`${seconds.toFixed(1)}s`)}`,
		);
	}

	console.log();
	if (failed.length === 0) {
		console.log(green(`All ${results.length} checks passed`));
	} else {
		const names = failed.map((r) => r.name).join(", ");
		console.log(
			red(`${failed.length} of ${results.length} checks failed: ${names}`),
		);
	}
}

const results = await runChecks(CHECKS);
const failed = results.filter((r) => !r.ok);
printFailures(failed);
printSummary(results, failed);
process.exit(failed.length === 0 ? 0 : 1);
