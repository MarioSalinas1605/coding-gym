const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;

type TimeUnit = "m" | "h";

interface ClampTimeParams {
	time: number;
	unit: TimeUnit;
}
type TimeAndCarry = [time: number, remainder: number];

export function wrapTime({
	time = 0,
	unit,
}: ClampTimeParams): TimeAndCarry {
	const isNegative = time < 0;
	const unitsPerCycle = unit === "m" ? MINUTES_IN_HOUR : HOURS_IN_DAY;
	if (Math.abs(time) >= unitsPerCycle) {
		const quotient = time / unitsPerCycle;
		const remainder = time % unitsPerCycle;
		const carry = isNegative
			? Math.ceil(quotient)
			: Math.floor(quotient);
		return [remainder, carry];
	}
	return [time, 0];
}

interface AddTimeParams {
	currentTime: number;
	timeToAdd: number;
	unit: TimeUnit;
}

export function addTime({
	currentTime = 0,
	timeToAdd = 0,
	unit,
}: AddTimeParams): TimeAndCarry {
	const unitsPerCycle = unit === "m" ? MINUTES_IN_HOUR : HOURS_IN_DAY;

	const [clampedTime, remainderTime] = wrapTime({
		time: currentTime + timeToAdd,
		unit,
	});

	const normalizedTime = clampedTime < 0 ? unitsPerCycle + clampedTime : clampedTime;
	const normalizedCarry = clampedTime < 0 ? remainderTime - 1 : remainderTime;

	return [normalizedTime, normalizedCarry];
}

type HoursAndMinutes = [hours: number, minutes: number]

const INITIAL_MINUTES = 0;
const INITIAL_HOURS = 0;

export function initializeTime(hours: number, minutes: number): HoursAndMinutes {
	const [clamedMinutes, remainderClampHours] = wrapTime({
		time: minutes,
		unit: "m"
	})
	const [clamedHours] = wrapTime({
		time: hours + remainderClampHours,
		unit: "h"
	})


	const[newMinutes, remaindedAddHours] = addTime({
		currentTime: INITIAL_MINUTES,
		timeToAdd: clamedMinutes, 
		unit: "m"
	})

	const [newHours] = addTime({
		currentTime: INITIAL_HOURS,
		timeToAdd: clamedHours + remaindedAddHours,
		unit: "h"
	})

	return [newHours, newMinutes]
}

export class Clock {
	hour: number;
	minute: number;

	constructor(hour: number, minute?: number) {
		const[parsedHours, parsedMinutes] = initializeTime(hour, minute ?? 0)
		this.hour = parsedHours
		this.minute = parsedMinutes
	}

	public toString(): string {
		const hours = this.hour < 10 ? `0${this.hour}` : this.hour
		const minutes = this.minute < 10 ? `0${this.minute}` : this.minute
		return `${hours}:${minutes}`
	}

	public plus(minutes: number): Clock {
		const [modifiedMinutes, remainderHours] = addTime({
			currentTime: this.minute,
			timeToAdd: minutes,
			unit: "m"
		})
		const[modifiedHours] = addTime({
			currentTime: this.hour,
			timeToAdd: remainderHours,
			unit: "h"
		})
		this.minute = modifiedMinutes
		this.hour = modifiedHours
		return this
	}

	public minus(minutes: number): Clock {
		this.plus(-minutes)
		return this
	}

	public equals(other: Clock): boolean {
		const sameMinute = this.minute === other.minute
		const sameHour = this.hour === other.hour
		return sameMinute && sameHour
	}
}

new Clock(8);
