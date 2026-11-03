import { afterEach, beforeEach, describe, expect, test, vi } from "bun:test";
import debounce from "./solution";

describe("Debounce tests", () => {
	const DEBOUNCE_TIME = 100;
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	test("returns a function", () => {
		const debouncedFn = debounce(() => {}, 0);

		expect(debouncedFn).toBeTypeOf("function");
	});

	test("invokes once, only after wait ms of inactivity", () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, DEBOUNCE_TIME);

		debouncedFn();
		debouncedFn();
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(DEBOUNCE_TIME - 1);
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	test("passes params to original function", () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, DEBOUNCE_TIME);

		debouncedFn(10);
		vi.advanceTimersByTime(DEBOUNCE_TIME);

		expect(fn).toHaveBeenCalledWith(10);
	});

	test("multiple debounce call executes with the last param", () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, DEBOUNCE_TIME);

		debouncedFn("a");
		debouncedFn("b");
		vi.advanceTimersByTime(DEBOUNCE_TIME);

		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith("b");
	});

	test("keeps reference to 'this' object", () => {
		const fn = vi.fn();
		const obj = { debouncedFn: debounce(fn, DEBOUNCE_TIME) };

		obj.debouncedFn();
		vi.advanceTimersByTime(DEBOUNCE_TIME);

		expect(fn).toHaveBeenCalledTimes(1);
		const thisFnReceived = fn.mock.contexts[0];
		expect(thisFnReceived).toBe(obj);
	});
});
