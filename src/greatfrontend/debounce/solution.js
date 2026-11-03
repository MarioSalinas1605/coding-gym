export default function debounce(func, wait) {
	let timerId = null;
	return function (...args) {
		clearTimeout(timerId);
		timerId = setTimeout(() => func.apply(this, args), wait);
	};
}
