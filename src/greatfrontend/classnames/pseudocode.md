# classNames: pseudocode

```text
classNames(args):
    result = empty list of classes

    for each arg in args:
        if arg is falsy:
            skip it

        else if arg is a string or a number:
            add arg to result

        else if arg is an array:
            call classNames on the array's elements
            add what comes back to result

        else if typeof arg is "object":
            for each key in arg:
                if the value at that key is truthy:
                    add key to result

        (anything else, like `true`, matches no branch and is ignored)

    return result joined with single spaces
```

## Why this order

- The falsy check removes `null`, so it must come before the object check.
- The array check must come before the object check, because `typeof []` is `"object"`.
- After both, `typeof arg === "object"` can only mean a real object.
- Recursion applies only to arrays. Object values are just truthy/falsy flags.
