export function isPalindrome(value: number): boolean {
	let valueDigits: number = value;
	let reversed: number = 0;

	if (value < 0) {
		return false;
	}

	while (valueDigits) {
		const reminder = valueDigits % 10;
		reversed = reversed * 10 + reminder;
		valueDigits = Math.floor(valueDigits / 10);
	}

	return value === reversed;
}
