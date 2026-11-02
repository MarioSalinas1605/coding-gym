Array.prototype.myReduce = function (callbackFn, ...args) {
	// biome-ignore lint/complexity/noUselessThisAlias: in order to make the function more verbose
	const data = this;
	const hasInitialValue = args.length > 0;
	const initialValue = args[0];

	const indexNonHoleElement = data.findIndex((_, index) => index in data);
	if (indexNonHoleElement === -1) {
		if (hasInitialValue) {
			return initialValue;
		} else {
			throw new TypeError("Array with only holes");
		}
	}

	let accumulator = hasInitialValue ? initialValue : data[indexNonHoleElement];
	for (
		let index = hasInitialValue ? 0 : indexNonHoleElement + 1;
		index < data.length;
		index++
	) {
		const isHole = !(index in data);
		if (isHole) {
			continue;
		}

		const value = data[index];
		accumulator = callbackFn(accumulator, value, index, data);
	}
	return accumulator;
};
