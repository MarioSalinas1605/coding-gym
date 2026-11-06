export class Size {
	constructor(width = 80, height = 60) {
		this.width = width;
		this.height = height;
	}

	resize(width, height) {
		this.width = width;
		this.height = height;
	}
}

export class Position {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	move(newX, newY) {
		this.x = newX;
		this.y = newY;
	}
}

function clamp({ value, max, requested, min }) {
	if (requested < min) {
		return min;
	}
	const endEdge = value + requested;
	if (endEdge > max) {
		return max - value;
	}
	return requested;
}

const MINIMUM_SIZE = 1;
const MINIMUM_POSITION = 0;
const DEFAULT_SCREEN_SIZE = {
	width: 800,
	height: 600,
};

export class ProgramWindow {
	constructor() {
		this.screenSize = new Size(
			DEFAULT_SCREEN_SIZE.width,
			DEFAULT_SCREEN_SIZE.height,
		);
		this.size = new Size();
		this.position = new Position();
	}

	resize(newSize) {
		const normalizedHeight = clamp({
			value: this.position.y,
			max: this.screenSize.height,
			requested: newSize.height,
			min: MINIMUM_SIZE,
		});
		const normalizedWidth = clamp({
			value: this.position.x,
			max: this.screenSize.width,
			requested: newSize.width,
			min: MINIMUM_SIZE,
		});

		this.size.resize(normalizedWidth, normalizedHeight);
	}

	move(newPosition) {
		const normalizeX = clamp({
			value: this.size.width,
			max: this.screenSize.width,
			requested: newPosition.x,
			min: MINIMUM_POSITION,
		});

		const normalizeY = clamp({
			value: this.size.height,
			max: this.screenSize.height,
			requested: newPosition.y,
			min: MINIMUM_POSITION,
		});

		this.position.move(normalizeX, normalizeY);
	}
}

export function changeWindow(windowInstance) {
	const size = new Size(400, 300);
	const position = new Position(100, 150);
	windowInstance.resize(size);
	windowInstance.move(position);
	return windowInstance;
}
