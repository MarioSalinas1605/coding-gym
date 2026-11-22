import { describe, expect, test } from "bun:test";
import {
	checkPhoneNumber,
	getURL,
	isValidCommand,
	niceToMeetYou,
	removeEmoji,
} from "./solution";

describe("Regular Chatbot", () => {
	describe("isValidCommand", () => {
		test('should allow sentences with "Chatbot" at the beggining', () => {
			const sentence = "Chatbot, play a song from the 80's.";
			expect(isValidCommand(sentence)).toBe(true);
		});
		test('should allow sentences with "Chatbot" at the beggining', () => {
			const sentence = "Hey Chatbot, where is the closest pharmacy?";
			expect(isValidCommand(sentence)).toBe(false);
		});
		test('should fail sentences with "Chatbot" at the beggining', () => {
			const sentence = "CHATBOT, do you have a solution for this challenge?";
			expect(isValidCommand(sentence)).toBe(true);
		});
	});
	describe("removeEmoji", () => {
		test("removes the word containing emoji", () => {
			const sentence =
				"I love playing videogames emoji3465 it's one of my hobbies";
			const sentenceWithoutEmoji =
				"I love playing videogames  it's one of my hobbies";
			expect(removeEmoji(sentence)).toBe(sentenceWithoutEmoji);
		});
		test("untouches sentences without emoji", () => {
			const sentence = "Hello world";
			expect(removeEmoji(sentence)).toBe(sentence);
		});
	});
	describe("checkPhoneNumber", () => {
		test("success on valid format", () => {
			const number = "(+34) 659-771-594";
			const successPhrase = "Thanks! You can now download me to your phone.";
			expect(checkPhoneNumber(number)).toBe(successPhrase);
		});
		test("success on valid format", () => {
			const number = "659-771-594";
			const failPhrase = `Oops, it seems like I can't reach out to ${number}`;
			expect(checkPhoneNumber(number)).toBe(failPhrase);
		});
	});
	describe("getURL", () => {
		test("extracts all domains from the sentence", () => {
			const sentence =
				"I learned a lot from exercism.org and developer.mozilla.org, but I found ts39.es very boring!";
			expect(getURL(sentence)).toEqual([
				"exercism.org",
				"developer.mozilla.org",
				"ts39.es",
			]);
		});
	});
	describe("niceToMeetYou", () => {
		test("greets the user with first and last name swapped", () => {
			expect(niceToMeetYou("Smith, John")).toBe("Nice to meet you, John Smith");
		});
	});
});
