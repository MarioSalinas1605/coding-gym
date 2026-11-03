# Debounce

https://www.greatfrontend.com/interviews/study/gfe75/questions/javascript/debounce

## Problem

Debouncing controls how often a function can execute over time. When a JavaScript function is debounced with a wait time of `wait` milliseconds, it runs only after `wait` milliseconds have elapsed since the debounced function was last called.

You have probably encountered debouncing in daily life before, such as when entering an elevator. Only after some time passes without pressing the "Door open" button (the debounced function not being called) will the elevator door actually close (the callback function is executed).

Implement `debounce(func, wait)` so that `func` is called only after `wait` milliseconds have passed since the most recent call. The returned function should not invoke `func` immediately. When the delayed call finally runs, it should use the latest arguments and preserve the `this` value from the most recent call.

### Arguments

1. `func` _(Function)_: The callback to debounce.
2. `wait` _(number)_: The number of milliseconds to wait after the latest call.

### Returns

_(Function)_: Returns the debounced function.

### Examples

```js
let i = 0;
function increment() {
  i++;
}
const debouncedIncrement = debounce(increment, 100);

// t = 0: Call debouncedIncrement().
debouncedIncrement(); // i = 0

// t = 50: i is still 0 because 100ms have not passed.

// t = 100: increment() was invoked and i is now 1.
```

`debouncedIncrement()` is called multiple times.

```js
let i = 0;
function increment() {
  i++;
}
const debouncedIncrement = debounce(increment, 100);

// t = 0: Call debouncedIncrement().
debouncedIncrement(); // i = 0

// t = 50: i is still 0 because 100ms have not passed.
//  Call debouncedIncrement() again.
debouncedIncrement(); // i = 0

// t = 100: i is still 0 because it has only
//  been 50ms since the last debouncedIncrement() at t = 50.

// t = 150: Because 100ms have passed since
//  the last debouncedIncrement() at t = 50,
//  increment was invoked and i is now 1.
```

### Follow-up

- Debounce with a `cancel()` method to cancel delayed invocations and a `flush()` method to immediately invoke them.
- Implement [throttle](https://www.greatfrontend.com/questions/javascript/throttle), which is similar to debounce but a little different.

### Reading

- [Debounce on Lodash Documentation](https://lodash.com/docs/4.17.15#debounce)

## Notes

<!-- Approach, complexity, things learned -->
