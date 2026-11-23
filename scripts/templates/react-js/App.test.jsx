import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

afterEach(cleanup);

describe("{{title}}", () => {
	test.todo("example 1", async () => {
		const user = userEvent.setup();
		render(<App />);
		await user.click(screen.getByRole("button", { name: "Submit" }));
		expect(screen.getByRole("list").children).toHaveLength(1);
	});
});
