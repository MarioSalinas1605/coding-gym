import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

afterEach(cleanup);

const getItems = () =>
	within(screen.getByRole("list")).getAllByRole("listitem");

const getInput = () => screen.getByLabelText<HTMLInputElement>("New task");

const getSubmit = () => screen.getByRole("button", { name: "Submit" });

describe("Todo List", () => {
	test("renders the default tasks", () => {
		render(<App />);
		const items = getItems();
		expect(items).toHaveLength(3);
		expect(items[0]?.textContent).toContain("Walk the dog");
		expect(items[1]?.textContent).toContain("Water the plants");
		expect(items[2]?.textContent).toContain("Wash the dishes");
	});

	test("adds a task on Submit and clears the input", async () => {
		const user = userEvent.setup();
		render(<App />);
		await user.type(getInput(), "Buy milk");
		await user.click(getSubmit());

		const items = getItems();
		expect(items).toHaveLength(4);
		expect(items[3]?.textContent).toContain("Buy milk");
		expect(getInput().value).toBe("");
	});

	test("adds a task on Enter", async () => {
		const user = userEvent.setup();
		render(<App />);
		await user.type(getInput(), "Read a book{Enter}");

		expect(getItems()).toHaveLength(4);
		expect(screen.getByText("Read a book")).toBeTruthy();
	});

	test("trims surrounding whitespace", async () => {
		const user = userEvent.setup();
		render(<App />);
		await user.type(getInput(), "  Call mom  ");
		await user.click(getSubmit());

		expect(screen.getByText("Call mom").textContent).toBe("Call mom");
	});

	test("ignores empty and whitespace-only input", async () => {
		const user = userEvent.setup();
		render(<App />);
		await user.click(getSubmit());
		expect(getItems()).toHaveLength(3);

		await user.type(getInput(), "   ");
		await user.click(getSubmit());
		expect(getItems()).toHaveLength(3);
	});

	test("treats input as plain text", async () => {
		const user = userEvent.setup();
		const { container } = render(<App />);
		await user.type(getInput(), "<b>bold</b>");
		await user.click(getSubmit());

		expect(screen.getByText("<b>bold</b>")).toBeTruthy();
		expect(container.querySelector("b")).toBeNull();
	});

	test("deletes a task", async () => {
		const user = userEvent.setup();
		render(<App />);
		await user.click(
			screen.getByRole("button", { name: "Delete Water the plants" }),
		);

		expect(getItems()).toHaveLength(2);
		expect(screen.queryByText("Water the plants")).toBeNull();
	});

	test("shows the empty state when all tasks are deleted, and can add again", async () => {
		const user = userEvent.setup();
		render(<App />);
		await user.click(
			screen.getByRole("button", { name: "Delete Walk the dog" }),
		);
		await user.click(
			screen.getByRole("button", { name: "Delete Water the plants" }),
		);
		await user.click(
			screen.getByRole("button", { name: "Delete Wash the dishes" }),
		);

		expect(screen.getByText("Todo List Empty: Add some.")).toBeTruthy();
		expect(screen.queryByRole("list")).toBeNull();

		await user.type(getInput(), "Start fresh");
		await user.click(getSubmit());

		expect(getItems()).toHaveLength(1);
		expect(screen.queryByText("Todo List Empty: Add some.")).toBeNull();
	});
});
