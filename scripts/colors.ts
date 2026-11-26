/**
 * ANSI colors for terminal output. Disabled when stdout isn't a terminal or
 * `NO_COLOR` is set, so piped or logged output stays plain text.
 */

export const useColor = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;

const paint = (code: number) => (text: string) =>
	useColor ? `\x1b[${code}m${text}\x1b[0m` : text;

export const green = paint(32);
export const red = paint(31);
export const dim = paint(2);
