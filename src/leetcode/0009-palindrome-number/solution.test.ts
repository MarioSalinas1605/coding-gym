import { describe, expect, test } from "bun:test";
import { isPalindrome } from "./solution";

describe("Palindrome Number", () => {
	test("invalidate -negative numbers", () => {
		const negativeValue = -10;
		expect(isPalindrome(negativeValue)).toBe(false);
	});

	test("invalidate non palindrome value", () => {
		const nonPalindromValue = 10;
		expect(isPalindrome(nonPalindromValue)).toBe(false);
	});

	test("validate palindrome value", () => {
		const palindromeValue = 121;
		expect(isPalindrome(palindromeValue)).toBe(true);
	});
});
