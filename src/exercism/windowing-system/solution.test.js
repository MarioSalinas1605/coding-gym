import { describe, expect, test } from "bun:test";
import { changeWindow, Position, ProgramWindow, Size } from "./solution";

describe("Size", () => {
	test("assign default values", () => {
		const defaultWidth = 80;
		const defaultHeight = 60;
		const size = new Size();

		expect(size.width).toBe(defaultWidth);
		expect(size.height).toBe(defaultHeight);
	});
	test("assign params as initial values", () => {
		const width = 1080;
		const height = 764;
		const size = new Size(width, height);

		expect(size.width).toBe(width);
		expect(size.height).toBe(height);
	});
	test("change sizes", () => {
		const width = 1920;
		const height = 1080;
		const size = new Size();

		size.resize(width, height);
		expect(size.width).toBe(width);
		expect(size.height).toBe(height);
	});
});

describe("Position", () => {
	test("assign default values", () => {
		const defaultPosition = 0;

		const position = new Position();
		expect(position.x).toBe(defaultPosition);
		expect(position.y).toBe(defaultPosition);
	});
	test("assign params as initial values", () => {
		const xPosition = 100;
		const yPosition = 120;

		const position = new Position(xPosition, yPosition);
		expect(position.x).toBe(xPosition);
		expect(position.y).toBe(yPosition);
	});
	test("change position", () => {
		const newXPosition = 40;
		const newYPosition = 60;

		const position = new Position();
		position.move(newXPosition, newYPosition);
		expect(position.x).toBe(newXPosition);
		expect(position.y).toBe(newYPosition);
	});
});

describe("ProgramWindow", () => {
	test("fields with correct instances", () => {
		const programWindow = new ProgramWindow();

		expect(programWindow.screenSize).toBeInstanceOf(Size);
		expect(programWindow.size).toBeInstanceOf(Size);
		expect(programWindow.position).toBeInstanceOf(Position);
	});
	test("assigns default values", () => {
		const programWindow = new ProgramWindow();

		const defaultScreen = {
			width: 800,
			height: 600,
		};
		expect(programWindow.screenSize.width).toBe(defaultScreen.width);
		expect(programWindow.screenSize.height).toBe(defaultScreen.height);
	});

	describe("resize method", () => {
		test("should completely resize on valid sizes", () => {
			const programWindow = new ProgramWindow();
			const newSize = new Size(600, 400);

			programWindow.resize(newSize);
			expect(programWindow.size.width).toBe(newSize.width);
			expect(programWindow.size.height).toBe(newSize.height);
		});

		test("should not resize to negative values", () => {
			const programWindow = new ProgramWindow();
			const newSize = new Size(-1, -1);

			programWindow.resize(newSize);
			expect(programWindow.size.width).toBe(1);
			expect(programWindow.size.height).toBe(1);
		});

		test("should fit values on exceeded sizes", () => {
			const programWindow = new ProgramWindow();
			const newSize = new Size(1000, 1000);
			const defaultScreen = {
				width: 800,
				height: 600,
			};

			programWindow.resize(newSize);
			expect(programWindow.size.width).toBe(defaultScreen.width);
			expect(programWindow.size.height).toBe(defaultScreen.height);
		});
	});

	describe("move method", () => {
		test("should move window when new position does not exceed edges", () => {
			const programWindow = new ProgramWindow();
			const newPosition = new Position(50, 100);

			programWindow.move(newPosition);
			expect(programWindow.position.x).toBe(newPosition.x);
			expect(programWindow.position.y).toBe(newPosition.y);
		});

		test("should not move window to negative values", () => {
			const programWindow = new ProgramWindow();
			const newPosition = new Position(-1, -1);

			programWindow.move(newPosition);
			expect(programWindow.position.x).toBe(0);
			expect(programWindow.position.y).toBe(0);
		});

		test("should move window when new position exceed edges", () => {
			const programWindow = new ProgramWindow();
			const newPosition = new Position(900, 700);

			programWindow.move(newPosition);
			expect(programWindow.position.x).toBe(720);
			expect(programWindow.position.y).toBe(540);
		});
	});
});

describe("changeWindow", () => {
	const size = {
		width: 400,
		height: 300,
	};
	const position = {
		x: 100,
		y: 150,
	};

	test("should return a window", () => {
		const programWindow = new ProgramWindow();
		const result = changeWindow(programWindow);
		expect(result).toBeInstanceOf(ProgramWindow);
	});

	test("should change window to fixed values", () => {
		const programWindow = new ProgramWindow();
		changeWindow(programWindow);
		expect(programWindow.size.width).toBe(size.width);
		expect(programWindow.size.height).toBe(size.height);
		expect(programWindow.position.x).toBe(position.x);
		expect(programWindow.position.y).toBe(position.y);
	});
});
