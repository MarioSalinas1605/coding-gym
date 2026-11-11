import { beforeEach, describe, expect, mock, test } from "bun:test";
import {
	ArgumentError,
	checkHumidityLevel,
	monitorTheMachine,
	OverheatingError,
	reportOverheating,
} from "./solution";

describe("checkHumidityLevel", () => {
	test("throws if the humidity percentage is 71", () => {
		expect(() => checkHumidityLevel(71)).toThrow();
	});

	test("throws if the humidity percentage is 100", () => {
		expect(() => checkHumidityLevel(100)).toThrow();
	});

	test("does not throw if the humidity percentage is 70", () => {
		expect(() => checkHumidityLevel(70)).not.toThrow();
	});

	test("does not throw if the humidity percentage is 53", () => {
		expect(() => checkHumidityLevel(53)).not.toThrow();
	});
});

describe("reportOverheating", () => {
	test("does not throw if the temperature is 200°C", () => {
		expect(() => reportOverheating(200)).not.toThrow();
	});

	test("throws an ArgumentError if the temperature is null", () => {
		expect(() => reportOverheating(null)).toThrow(ArgumentError);
	});

	test("does not throw if the temperature is 0°C", () => {
		expect(() => reportOverheating(0)).not.toThrow();
	});

	test("throws an OverheatingError with the temperature if it is 501°C", () => {
		expect(() => reportOverheating(501)).toThrow(OverheatingError);

		const getOverheatingErrorTemperature = () => {
			try {
				reportOverheating(501);
			} catch (error) {
				return error.temperature;
			}
		};
		expect(getOverheatingErrorTemperature()).toBe(501);
	});
});

describe("monitorTheMachine", () => {
	let actions;

	beforeEach(() => {
		actions = {
			check: mock(() => {}),
			alertDeadSensor: mock(() => {}),
			alertOverheating: mock(() => {}),
			shutdown: mock(() => {}),
		};
	});

	test("calls the check function once", () => {
		monitorTheMachine(actions);
		expect(actions.check).toHaveBeenCalledTimes(1);
	});

	test("does not call any action if the check passes", () => {
		monitorTheMachine(actions);
		expect(actions.alertDeadSensor).not.toHaveBeenCalled();
		expect(actions.alertOverheating).not.toHaveBeenCalled();
		expect(actions.shutdown).not.toHaveBeenCalled();
	});

	test("calls alertDeadSensor if the check throws an ArgumentError", () => {
		actions.check = mock(() => {
			throw new ArgumentError();
		});
		monitorTheMachine(actions);
		expect(actions.alertDeadSensor).toHaveBeenCalledTimes(1);
		expect(actions.alertOverheating).not.toHaveBeenCalled();
		expect(actions.shutdown).not.toHaveBeenCalled();
	});

	test("calls shutdown if the temperature is above 600°C (651°C)", () => {
		actions.check = mock(() => {
			throw new OverheatingError(651);
		});
		monitorTheMachine(actions);
		expect(actions.alertDeadSensor).not.toHaveBeenCalled();
		expect(actions.alertOverheating).not.toHaveBeenCalled();
		expect(actions.shutdown).toHaveBeenCalledTimes(1);
	});

	test("calls alertOverheating if the temperature is below 600°C (530°C)", () => {
		actions.check = mock(() => {
			throw new OverheatingError(530);
		});
		monitorTheMachine(actions);
		expect(actions.alertDeadSensor).not.toHaveBeenCalled();
		expect(actions.alertOverheating).toHaveBeenCalledTimes(1);
		expect(actions.shutdown).not.toHaveBeenCalled();
	});

	test("rethrows any other error", () => {
		class UnknownError extends Error {}
		actions.check = mock(() => {
			throw new UnknownError();
		});
		expect(() => monitorTheMachine(actions)).toThrow(UnknownError);
		expect(actions.alertDeadSensor).not.toHaveBeenCalled();
		expect(actions.alertOverheating).not.toHaveBeenCalled();
		expect(actions.shutdown).not.toHaveBeenCalled();
	});
});
