# Todo List

https://www.greatfrontend.com/interviews/study/gfe75/questions/user-interface/todo-list?qns_context=42885b63-3fcd-4849-b6a2-e1d086ce1f4f

## Problem

You're given the HTML for a Todo List app. Add support for creating tasks and deleting existing ones.

### Requirements

Add the following functionality to the app:

1. Add new tasks on clicking the "Submit" button.
    - The `<input>` field should be cleared upon successful addition.
    - Treat task input as plain text; user-provided markup must not be interpreted as HTML.
2. Remove tasks from the Todo List upon clicking the "Delete" button.

Give the task input an accessible label so the form is operable with assistive technology.

### Notes

- The focus of this question is on functionality, not styling. There's no need to write any custom CSS.
- You may modify the markup (e.g. adding `id`s, data attributes, replacing some tags, etc.), but the result should remain the same visually.
- You may want to think about ways to improve the user experience of the application and implement them (you get bonus credit for doing that during interviews).

## Run

```bash
bun test src/greatfrontend/todo-list   # from the repo root, or `bun test` in this folder
cd src/greatfrontend/todo-list && bun dev   # open the printed URL
```

## Notes

<!-- Approach, UX improvements, things learned -->
