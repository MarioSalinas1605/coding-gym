import { describe, expect, test } from "bun:test";
import { addTwoNumbers } from "./solution";
import { listNodeMaker, listNodeValue, reverseString } from "./utils";

describe("Add Two Numbers", () => {
	const setUpValues = (value1: number, value2: number) => {
		const numericResult = value1 + value2;
		const reversedValue1 = reverseString(String(value1));
		const reversedValue2 = reverseString(String(value2));
		const l1 = listNodeMaker(reversedValue1);
		const l2 = listNodeMaker(reversedValue2);
		return {
			l1,
			l2,
			numericResult,
		};
	};

	describe("LeetCode examples", () => {
		test("342 + 465 = 807", () => {
			const value1 = 342;
			const value2 = 465;
			const { l1, l2, numericResult } = setUpValues(value1, value2);

			const resultList = addTwoNumbers(l1, l2);

			const result = Number(reverseString(listNodeValue(resultList)));
			expect(result).toBe(numericResult);
		});

		test("0 + 0 = 0", () => {
			const value1 = 0;
			const value2 = 0;
			const { l1, l2, numericResult } = setUpValues(value1, value2);

			const resultList = addTwoNumbers(l1, l2);

			const result = Number(reverseString(listNodeValue(resultList)));
			expect(result).toBe(numericResult);
		});

		test("9999999 + 9999 = 10009998", () => {
			const value1 = 9999999;
			const value2 = 9999;
			const { l1, l2, numericResult } = setUpValues(value1, value2);

			const resultList = addTwoNumbers(l1, l2);

			const result = Number(reverseString(listNodeValue(resultList)));
			expect(result).toBe(numericResult);
		});
	});

	describe("single-digit lists", () => {
		test("sum below 10 produces one node", () => {
			const value1 = 1;
			const value2 = 2;
			const { l1, l2, numericResult } = setUpValues(value1, value2);

			const resultList = addTwoNumbers(l1, l2);

			const result = Number(reverseString(listNodeValue(resultList)));
			expect(result).toBe(numericResult);
		});

		test("sum of exactly 10 appends a carry node", () => {
			const value1 = 5;
			const value2 = 5;
			const { l1, l2, numericResult } = setUpValues(value1, value2);

			const resultList = addTwoNumbers(l1, l2);

			const result = Number(reverseString(listNodeValue(resultList)));
			expect(result).toBe(numericResult);
		});

		test("largest digits 9 + 9 = 18", () => {
			const value1 = 9;
			const value2 = 9;
			const { l1, l2, numericResult } = setUpValues(value1, value2);

			const resultList = addTwoNumbers(l1, l2);

			const result = Number(reverseString(listNodeValue(resultList)));
			expect(result).toBe(numericResult);
		});
	});

	describe("lists of different lengths", () => {
		test("l1 longer than l2 copies remaining l1 digits", () => {
			const value1 = 321;
			const value2 = 4;
			const { l1, l2, numericResult } = setUpValues(value1, value2);

			const resultList = addTwoNumbers(l1, l2);

			const result = Number(reverseString(listNodeValue(resultList)));
			expect(result).toBe(numericResult);
		});

		test("l2 longer than l1 copies remaining l2 digits", () => {
			const value1 = 4;
			const value2 = 321;
			const { l1, l2, numericResult } = setUpValues(value1, value2);

			const resultList = addTwoNumbers(l1, l2);

			const result = Number(reverseString(listNodeValue(resultList)));
			expect(result).toBe(numericResult);
		});

		test("adding zero to l1 leaves l2 unchanged", () => {
			const value1 = 0;
			const value2 = 123;
			const { l1, l2, numericResult } = setUpValues(value1, value2);

			const resultList = addTwoNumbers(l1, l2);

			const result = Number(reverseString(listNodeValue(resultList)));
			expect(result).toBe(numericResult);
		});

		test("adding zero to l2 leaves l1 unchanged", () => {
			const value1 = 123;
			const value2 = 0;
			const { l1, l2, numericResult } = setUpValues(value1, value2);

			const resultList = addTwoNumbers(l1, l2);

			const result = Number(reverseString(listNodeValue(resultList)));
			expect(result).toBe(numericResult);
		});
	});

	describe("carry handling", () => {
		test("carry in the middle that does not reach the end", () => {
			const value1 = 15;
			const value2 = 15;
			const { l1, l2, numericResult } = setUpValues(value1, value2);

			const resultList = addTwoNumbers(l1, l2);

			const result = Number(reverseString(listNodeValue(resultList)));
			expect(result).toBe(numericResult);
		});

		test("carry ripples through the rest of the longer l1", () => {
			const value1 = 999;
			const value2 = 1;
			const { l1, l2, numericResult } = setUpValues(value1, value2);

			const resultList = addTwoNumbers(l1, l2);

			const result = Number(reverseString(listNodeValue(resultList)));
			expect(result).toBe(numericResult);
		});

		test("carry ripples through the rest of the longer l2", () => {
			const value1 = 1;
			const value2 = 99;
			const { l1, l2, numericResult } = setUpValues(value1, value2);

			const resultList = addTwoNumbers(l1, l2);

			const result = Number(reverseString(listNodeValue(resultList)));
			expect(result).toBe(numericResult);
		});

		test("carry ripples and produces zeros inside the result", () => {
			const value1 = 65;
			const value2 = 945;
			const { l1, l2, numericResult } = setUpValues(value1, value2);

			const resultList = addTwoNumbers(l1, l2);

			const result = Number(reverseString(listNodeValue(resultList)));
			expect(result).toBe(numericResult);
		});
	});

	describe("constraints and robustness", () => {
		// 100-digit numbers don't fit in a Number, so these use BigInt
		test("100-digit inputs beyond Number precision", () => {
			const ones = "1".repeat(100);
			const l1 = listNodeMaker(ones);
			const l2 = listNodeMaker(ones);

			const resultList = addTwoNumbers(l1, l2);

			const result = BigInt(reverseString(listNodeValue(resultList)));
			expect(result).toBe(BigInt(ones) * 2n);
		});

		test("100 nines + 1 produces a 101-digit result", () => {
			const nines = "9".repeat(100);
			const l1 = listNodeMaker(nines);
			const l2 = listNodeMaker("1");

			const resultList = addTwoNumbers(l1, l2);

			const result = BigInt(reverseString(listNodeValue(resultList)));
			expect(result).toBe(BigInt(nines) + 1n);
		});

		test("does not mutate the input lists", () => {
			const { l1, l2 } = setUpValues(99, 1);

			addTwoNumbers(l1, l2);

			expect(listNodeValue(l1)).toBe("99");
			expect(listNodeValue(l2)).toBe("1");
		});
	});
});
