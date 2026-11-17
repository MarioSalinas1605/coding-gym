import { ListNode } from "./solution";

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
