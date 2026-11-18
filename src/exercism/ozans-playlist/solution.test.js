import { describe, expect, test } from "bun:test";
import {
	addTrack,
	deleteTrack,
	hasTrack,
	listArtists,
	removeDuplicates,
} from "./solution";

const TRACK_1 = "Two Paintings and a Drum - Carl Cox";
const TRACK_2 = "Leash Called Love - The Sugarcubes";

describe("removeDuplicates", () => {
	test("works for an empty playlist", () => {
		const playlist = [];
		expect(removeDuplicates(playlist)).toEqual([]);
	});

	test("removes duplicate tracks", () => {
		const playlist = [TRACK_1, TRACK_2, TRACK_1];
		const expected = [TRACK_1, TRACK_2];
		expect(removeDuplicates(playlist)).toEqual(expected);
	});
});

describe("hasTrack", () => {
	test("returns true when the track is in the playlist", () => {
		const playlist = [TRACK_1, TRACK_2];
		expect(hasTrack(playlist, TRACK_1)).toBe(true);
	});
});

describe("addTrack", () => {
	test("adds a track that is not already in the playlist", () => {
		const playlist = [];
		const expected = [TRACK_1];
		expect(addTrack(playlist, TRACK_1)).toEqual(expected);
	});

	test("does not add a track that is already in the playlist", () => {
		const playlist = [TRACK_1, TRACK_2];
		const expected = [TRACK_1, TRACK_2];
		expect(addTrack(playlist, TRACK_1)).toEqual(expected);
	});
});

describe("deleteTrack", () => {
	test("deletes a track that is in the playlist", () => {
		const playlist = [TRACK_1, TRACK_2];
		const expected = [TRACK_2];
		expect(deleteTrack(playlist, TRACK_1)).toEqual(expected);
	});

	test("does nothing when the track is not in the playlist", () => {
		const playlist = [TRACK_2];
		const expected = [TRACK_2];
		expect(deleteTrack(playlist, TRACK_1)).toEqual(expected);
	});
});

describe("listArtists", () => {
	test("works for an empty playlist", () => {
		const playlist = [];
		expect(listArtists(playlist)).toEqual([]);
	});

	test("lists unique artists", () => {
		const playlist = [
			"Onu Alma Beni Al - Sezen Aksu",
			"Famous Blue Raincoat - Leonard Cohen",
			"Rakkas - Sezen Aksu",
		];
		const expected = ["Sezen Aksu", "Leonard Cohen"];
		expect(listArtists(playlist)).toEqual(expected);
	});
});
