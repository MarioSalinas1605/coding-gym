import { describe, expect, test } from "bun:test";
import "./solution";

const add = (prev, curr) => prev + curr;
const multiply = (prev, curr) => prev * curr;

describe("Array Reduce", () => {
	describe("examples", () => {
		test("initial value 0", () => {
			expect([1, 2, 3].myReduce(add, 0)).toBe(6);
		});

		test("initial value 4", () => {
			expect([1, 2, 3].myReduce(add, 4)).toBe(10);
		});
	});

	describe("empty array", () => {
		test("with initial value returns the initial value", () => {
			expect([].myReduce(add, 0)).toBe(0);
			expect([].myReduce(add, "x")).toBe("x");
		});

		test("without initial value throws a TypeError", () => {
			expect(() => [].myReduce(add)).toThrow(TypeError);
		});

		test("does not call the callback", () => {
			let calls = 0;
			[].myReduce(() => calls++, 0);
			expect(calls).toBe(0);
		});
	});

	describe("single element", () => {
		test("with initial value", () => {
			expect([1].myReduce(add, 0)).toBe(1);
		});

		test("without initial value returns the element without calling the callback", () => {
			let calls = 0;
			const result = [7].myReduce(() => {
				calls++;
				return 999;
			});
			expect(result).toBe(7);
			expect(calls).toBe(0);
		});
	});

	describe("multiple elements", () => {
		test("two values", () => {
			expect([-4, 10].myReduce(add, 0)).toBe(6);
		});

		test("without initial value uses the first element as accumulator", () => {
			expect([1, 2, 3, 4].myReduce(add)).toBe(10);
			expect([1, 2, 3, 4].myReduce(multiply)).toBe(24);
		});

		test("strings", () => {
			expect(["b", "c", "d"].myReduce(add, "")).toBe("bcd");
			expect(["b", "c", "d"].myReduce(add, "a")).toBe("abcd");
		});

		test("builds an object", () => {
			const result = ["a", "b", "a"].myReduce((acc, curr) => {
				acc[curr] = (acc[curr] ?? 0) + 1;
				return acc;
			}, {});
			expect(result).toEqual({ a: 2, b: 1 });
		});

		test("flattens arrays", () => {
			expect(
				[[1], [2, 3], [4]].myReduce((acc, curr) => acc.concat(curr), []),
			).toEqual([1, 2, 3, 4]);
		});
	});

	describe("falsy initial values are still initial values", () => {
		test("undefined passed explicitly", () => {
			expect(
				[1, 2].myReduce((acc, curr) => [acc, curr].join(","), undefined),
			).toBe(",1,2");
		});

		test("null", () => {
			expect([1, 2].myReduce((acc, curr) => (acc ?? 0) + curr, null)).toBe(3);
		});

		test("empty array with explicit undefined does not throw", () => {
			expect([].myReduce(add, undefined)).toBeUndefined();
		});
	});

	describe("callback arguments", () => {
		test("receives index", () => {
			expect([1, 2, 3].myReduce((acc, _curr, index) => acc + index, 0)).toBe(3);
		});

		test("index starts at 1 without an initial value", () => {
			const indices = [];
			[10, 20, 30].myReduce((acc, curr, index) => {
				indices.push(index);
				return acc + curr;
			});
			expect(indices).toEqual([1, 2]);
		});

		test("receives the original array", () => {
			const arr = [1, 2, 3];
			let received;
			arr.myReduce((acc, curr, _index, array) => {
				received = array;
				return acc + curr;
			}, 0);
			expect(received).toBe(arr);
		});
	});

	describe("sparse arrays", () => {
		test("skips holes", () => {
			// biome-ignore lint/suspicious/noSparseArray: testing holes
			const arr = [1, 2, , 4];
			const visited = [];
			const result = arr.myReduce((acc, curr, index) => {
				visited.push(index);
				return acc + curr;
			}, 0);
			expect(result).toBe(7);
			expect(visited).toEqual([0, 1, 3]);
		});

		test("first non-hole element is the accumulator without an initial value", () => {
			// biome-ignore lint/suspicious/noSparseArray: testing holes
			const arr = [, , 5, 6];
			expect(arr.myReduce(add)).toBe(11);
		});

		test("array of only holes without initial value throws", () => {
			expect(() => new Array(3).myReduce(add)).toThrow(TypeError);
		});

		test("array of only holes with initial value returns the initial value", () => {
			expect(new Array(3).myReduce(add, 0)).toBe(0);
		});

		test("single hole without initial value throws", () => {
			// biome-ignore lint/suspicious/noSparseArray: testing holes
			expect(() => [,].myReduce(add)).toThrow(TypeError);
		});

		test("explicit undefined is an element, not a hole", () => {
			const visited = [];
			[undefined, 1].myReduce((acc, _curr, index) => {
				visited.push(index);
				return acc + 1;
			}, 0);
			expect(visited).toEqual([0, 1]);
		});

		test("single explicit undefined without initial value is returned", () => {
			expect([undefined].myReduce(add)).toBeUndefined();
		});

		test("explicit undefined first element is the accumulator without an initial value", () => {
			expect([undefined, 1].myReduce(add)).toBeNaN();
		});

		test("only explicit undefined with initial value still calls the callback", () => {
			expect([undefined, undefined].myReduce((count) => count + 1, 0)).toBe(2);
		});
	});

	describe("falsy elements are not skipped", () => {
		test("visits 0", () => {
			const visited = [];
			[1, 0, 2].myReduce((acc, _curr, index) => {
				visited.push(index);
				return acc + 1;
			}, 0);
			expect(visited).toEqual([0, 1, 2]);
		});

		test("visits every falsy value", () => {
			const falsies = [0, "", false, null, undefined, Number.NaN];
			expect(falsies.myReduce((count) => count + 1, 0)).toBe(falsies.length);
		});

		test("falsy first element is the accumulator without an initial value", () => {
			expect([0, 1, 2].myReduce(add)).toBe(3);
			expect(["", "a"].myReduce(add)).toBe("a");
		});
	});

	test("does not mutate the original array", () => {
		const arr = [1, 2, 3];
		arr.myReduce(add, 0);
		expect(arr).toEqual([1, 2, 3]);
	});

	test("matches native reduce", () => {
		const reducer = (acc, curr, index) => acc * 2 + curr - index;
		const arr = [3, 1, 4, 1, 5, 9, 2, 6];
		expect(arr.myReduce(reducer)).toBe(arr.reduce(reducer));
		expect(arr.myReduce(reducer, 7)).toBe(arr.reduce(reducer, 7));
	});
});
