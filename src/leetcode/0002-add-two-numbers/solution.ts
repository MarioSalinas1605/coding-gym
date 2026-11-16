// Definition for singly-linked list.
export class ListNode {
	val: number;
	next: ListNode | null;
	constructor(val?: number, next?: ListNode | null) {
		this.val = val === undefined ? 0 : val;
		this.next = next === undefined ? null : next;
	}
}

export function listNodeValue(list: ListNode | null): string {
	let currentNode: ListNode | null = list;
	let result = "";

	while (currentNode !== null) {
		result += currentNode.val;
		currentNode = currentNode.next;
	}
	return result;
}

export function listNodeMaker(value: string): ListNode | null {
	const elementsArray = value.split("");
	let headListNode: ListNode | null = null;
	let prevListNode: ListNode | null = null;

	for (const element of elementsArray) {
		const newNode = new ListNode(Number(element));
		if (!headListNode) {
			headListNode = newNode;
		} else if (prevListNode) {
			prevListNode.next = newNode;
		}
		prevListNode = newNode;
	}
	return headListNode;
}

export const reverseString = (value: string) =>
	value.split("").reverse().join("");

export function addTwoNumbers(
	l1: ListNode | null,
	l2: ListNode | null,
): ListNode | null {
	const l1Value = listNodeValue(l1);
	const l2Value = listNodeValue(l2);
	const value1 = reverseString(l1Value);
	const value2 = reverseString(l2Value);
	const result = Number(value1) + Number(value2);
	const reversedResult = reverseString(String(result));
	const listResult = listNodeMaker(reversedResult);
	return listResult;
}
