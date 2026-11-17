// Definition for singly-linked list.
export class ListNode {
	val: number;
	next: ListNode | null;
	constructor(val?: number, next?: ListNode | null) {
		this.val = val === undefined ? 0 : val;
		this.next = next === undefined ? null : next;
	}
}

interface DigitSum {
	carry: number;
	digit: number;
}

export function sumDigits(digit1: number, digit2: number, base = 10): DigitSum {
	const sum = digit1 + digit2;

	return {
		carry: Math.floor(sum / base),
		digit: sum % base,
	};
}

interface addElementToListParams {
	list: ListNode | null;
	listTail: ListNode | null;
	value: number;
}

function addElementToList({ list, listTail, value }: addElementToListParams) {
	if (!list) {
		list = new ListNode(value);
		listTail = list;
	} else if (listTail) {
		const newNode = new ListNode(value);
		listTail.next = newNode;
		listTail = listTail.next;
	}
	return {
		list,
		listTail,
	};
}

export function addTwoNumbers(
	l1: ListNode | null,
	l2: ListNode | null,
): ListNode | null {
	let currentL1: ListNode | null | undefined = l1;
	let currentL2: ListNode | null | undefined = l2;
	let resultList: ListNode | null = null;
	let resultTail: ListNode | null = null;
	let carry = 0;

	while (currentL1?.val !== undefined || currentL2?.val !== undefined) {
		const val1 = currentL1?.val;
		const val2 = currentL2?.val;

		const { carry: nextCarry, digit } = sumDigits(
			val1 ?? 0,
			(val2 ?? 0) + carry,
		);
		carry = nextCarry;

		const { list: listHead, listTail } = addElementToList({
			list: resultList,
			listTail: resultTail,
			value: digit,
		});
		resultList = listHead;
		resultTail = listTail;

		currentL1 = currentL1?.next;
		currentL2 = currentL2?.next;
	}
	if (carry) {
		const { list: listHead, listTail } = addElementToList({
			list: resultList,
			listTail: resultTail,
			value: carry,
		});
		resultList = listHead;
		resultTail = listTail;
	}
	return resultList;
}
