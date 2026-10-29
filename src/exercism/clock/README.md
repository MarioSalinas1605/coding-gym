# Clock

https://exercism.org/tracks/typescript/exercises/clock

## Problem

### Instructions

Implement a clock that handles times without dates.

You should be able to add and subtract minutes to it.

Two clocks that represent the same time should be equal to each other.

## Notes

<!-- Approach, complexity, things learned -->

- **Store a single number: total minutes since midnight** (`hours * 60 + minutes`), normalized to `[0, 1440)`. Having separate hours and minutes means carrying overflow from minutes into hours. With one number there's no carry.
- `plus` / `minus` add to that number and normalize again. `equals` compares the two numbers.
- Only `toString` splits the number back into hours and minutes (integer division for hours, `%` for minutes).
- **JS `%` is a remainder, not a modulo.** The result takes the sign of the left-hand number, so `-7 % 5 === -2`. To wrap any integer into `[0, m)`: take the remainder, add `m`, then take the remainder again. No `isNegative` branch needed.

- Time:
- Space:
