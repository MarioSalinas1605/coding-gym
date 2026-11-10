import { describe, expect, test } from "bun:test";
import classNames from "./solution";

describe("Classnames", () => {
	describe("basic", () => {
		test("empty values", () => {
			expect(classNames([])).toEqual("");
		});

		test("empty object", () => {
			expect(classNames({})).toBe("");
		});

		test("single value", () => {
			expect(classNames("foo")).toEqual("foo");
		});

		test("two values", () => {
			expect(classNames("foo", "bar")).toEqual("foo bar");
		});
	});

	describe("falsy values", () => {
		test("ignores falsy arguments", () => {
			expect(classNames("a", 0, null, undefined, false, "b")).toBe("a b");
		});

		test("result is trimmed", () => {
			expect(classNames("", "b", {}, "")).toBe("b");
		});

		test("problem statement example", () => {
			expect(classNames(null, false, "bar", undefined, { baz: null }, "")).toBe(
				"bar",
			);
		});
	});

	describe("objects", () => {
		test("keeps keys with truthy values", () => {
			expect(
				classNames({ a: true, b: false, c: 0, d: null, e: undefined, f: 1 }),
			).toBe("a f");
		});

		test("mixed with strings", () => {
			expect(
				classNames("foo", { bar: true, duck: false }, "baz", { quux: true }),
			).toBe("foo bar baz quux");
		});
	});

	describe("arrays", () => {
		test("array of strings", () => {
			expect(classNames(["foo", "bar", "baz"])).toEqual("foo bar baz");
		});

		test("array followed by a string", () => {
			expect(classNames(["a", "b"], "c")).toBe("a b c");
		});

		test("string followed by an array", () => {
			expect(classNames("c", ["a", "b"])).toBe("c a b");
		});

		test("multiple arrays", () => {
			expect(classNames(["a", "b"], ["c", "d"])).toBe("a b c d");
		});

		test("ignores falsy and `true` items", () => {
			expect(classNames(["a", 0, null, undefined, false, true, "b"])).toBe(
				"a b",
			);
		});

		test("objects inside arrays", () => {
			expect(classNames("a", ["b", { c: true, d: false }])).toBe("a b c");
		});

		test("deep recursion", () => {
			expect(classNames(["a", ["b", ["c", { d: true }]]])).toBe("a b c d");
		});

		test("empty nested arrays", () => {
			expect(classNames("a", [[]])).toBe("a");
		});

		test("arrays that produce no classes don't add extra spaces", () => {
			expect(classNames("a", [null, [], { x: false }], "b")).toBe("a b");
		});
	});
});
