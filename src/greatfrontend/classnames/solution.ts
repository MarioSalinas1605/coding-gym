export type ClassValue =
	| ClassArray
	| ClassDictionary
	| string
	| number
	| null
	| boolean
	| undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = Array<ClassValue>;

export default function classNames(...args: Array<ClassValue>): string {
	let result = "";
	for (const element of args) {
		if (!element) {
			continue;
		}

		if (typeof element === "string" || typeof element === "number") {
			result += `${element} `;
			continue;
		}

		if (Array.isArray(element)) {
			const recursiveResult = classNames(...element);
			if (recursiveResult) {
				result += `${recursiveResult} `;
			}
			continue;
		}

		if (typeof element === "object") {
			for (const key of Object.keys(element)) {
				if (element[key]) {
					result += `${key} `;
				}
			}
		}
	}

	return result.trim();
}
