import { describe, expect, test } from "bun:test";
import {
	addTwoNumbers,
	ListNode,
	listNodeMaker,
	listNodeValue,
	reverseString,
} from "./solution";

describe("utils", () => {
	test("listNodeValue - get list value", () => {
		const node1 = new ListNode(1);
		const node2 = new ListNode(2);
		const node3 = new ListNode(3);

		node1.next = node2;
		node2.next = node3;

		expect(listNodeValue(node1)).toBe("123");
	});

	test("listNodeMaker - creates list", () => {
		const elements = "12345";
		let resultConcatenation = "";

		const headListReturned = listNodeMaker(elements);
		let currentNode = headListReturned;
		while (currentNode?.val) {
			resultConcatenation += currentNode.val;
			currentNode = currentNode.next;
		}

		expect(resultConcatenation).toBe(elements);
	});
});

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

	test("base case", () => {
		const value1 = 342;
		const value2 = 465;
		const { l1, l2, numericResult } = setUpValues(value1, value2);

		const resultList = addTwoNumbers(l1, l2);

		const result = Number(reverseString(listNodeValue(resultList)));
		expect(result).toBe(numericResult);
	});

	test("add zeros", () => {
		const value1 = 0;
		const value2 = 0;
		const { l1, l2, numericResult } = setUpValues(value1, value2);

		const resultList = addTwoNumbers(l1, l2);

		const result = Number(reverseString(listNodeValue(resultList)));
		expect(result).toBe(numericResult);
	});

	test("add bug numbers with 9", () => {
		const value1 = 9999999;
		const value2 = 9999;
		const { l1, l2, numericResult } = setUpValues(value1, value2);

		const resultList = addTwoNumbers(l1, l2);

		const result = Number(reverseString(listNodeValue(resultList)));
		expect(result).toBe(numericResult);
	});

	test("add leading to zero values", () => {
		const value1 = 65;
		const value2 = 945;
		const { l1, l2, numericResult } = setUpValues(value1, value2);

		const resultList = addTwoNumbers(l1, l2);

		const result = Number(reverseString(listNodeValue(resultList)));
		expect(result).toBe(numericResult);
	});
});
