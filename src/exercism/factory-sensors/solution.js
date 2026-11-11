export class ArgumentError extends Error {}

export class OverheatingError extends Error {
	constructor(temperature) {
		super(`The temperature is ${temperature} ! Overheating !`);
		this.temperature = temperature;
	}
}

/**
 * Check if the humidity level is not too high.
 *
 * @param {number} humidityPercentage
 * @throws {Error}
 */
const MAX_HUMIDITY_ALLOWED = 70;
export function checkHumidityLevel(humidityPercentage) {
	if (humidityPercentage > MAX_HUMIDITY_ALLOWED) {
		throw new Error("Humidity exceeded");
	}
}

/**
 * Check if the temperature is not too high.
 *
 * @param {number|null} temperature
 * @throws {ArgumentError|OverheatingError}
 */
const MAX_TEMPERATURE_ALLOWED = 500;
export function reportOverheating(temperature) {
	if (temperature === null) {
		throw new ArgumentError();
	}
	if (temperature > MAX_TEMPERATURE_ALLOWED) {
		throw new OverheatingError(temperature);
	}
}

/**
 *  Triggers the needed action depending on the result of the machine check.
 *
 * @param {{
 * check: function,
 * alertDeadSensor: function,
 * alertOverheating: function,
 * shutdown: function
 * }} actions
 * @throws {ArgumentError|OverheatingError|Error}
 */
const TOLERANCE_TEMPERATURE = 600;
export function monitorTheMachine(actions) {
	try {
		actions.check();
	} catch (error) {
		if (error instanceof ArgumentError) {
			actions.alertDeadSensor();
			return;
		}
		if (error instanceof OverheatingError) {
			if (error.temperature < TOLERANCE_TEMPERATURE) {
				actions.alertOverheating();
			}
			if (error.temperature > TOLERANCE_TEMPERATURE) {
				actions.shutdown();
			}
			return;
		}
		throw error;
	}
}
