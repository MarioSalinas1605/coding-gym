/**
 * Given a certain command, help the chatbot recognize whether the command is valid or not.
 *
 * @param {string} command
 * @returns {boolean} whether or not is the command valid
 */

export function isValidCommand(command) {
	const regex = /chatbot/i;
	const { index } = command.match(regex);
	return index === 0;
}

/**
 * Given a certain message, help the chatbot get rid of all the emoji's encryption through the message.
 *
 * @param {string} message
 * @returns {string} The message without the emojis encryption
 */
export function removeEmoji(message) {
	// biome-ignore lint/complexity/useRegexLiterals: It is required by the exercise
	const regex = new RegExp("emoji\\d+", "g");
	return message.replace(regex, "");
}

/**
 * Given a certain phone number, help the chatbot recognize whether it is in the correct format.
 *
 * @param {string} number
 * @returns {string} the Chatbot response to the phone Validation
 */
export function checkPhoneNumber(number) {
	const regex = /^\(\+\d{2}\) \d{3}-\d{3}-\d{3}$/;
	const isValid = number.match(regex);
	if (!isValid) {
		return `Oops, it seems like I can't reach out to ${number}`;
	}
	return "Thanks! You can now download me to your phone.";
}

/**
 * Given a certain response from the user, help the chatbot get only the URL.
 *
 * @param {string} userInput
 * @returns {string[] | null} all the possible URL's that the user may have answered
 */
export function getURL(userInput) {
	return userInput.match(/(?:[\w-]+\.)+[a-z]{2,}/gi);
}

/**
 * Greet the user using the full name data from the profile.
 *
 * @param {string} fullName
 * @returns {string} Greeting from the chatbot
 */
export function niceToMeetYou(fullName) {
	return fullName.replace(/(\w+),\s*(\w+)/, "Nice to meet you, $2 $1");
}
