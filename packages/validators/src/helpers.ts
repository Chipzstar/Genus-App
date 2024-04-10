import cryptoJS from "crypto-js";
import type { z } from "zod";

import type { currentYearSchema } from "./index";

export function prettyPrint(obj: any, char = "-") {
	console.log(char.repeat(40));
	console.log(obj);
	console.log(char.repeat(40));
}

export function checkProfileType(currentYear: z.infer<typeof currentYearSchema>) {
	switch (currentYear) {
		case "graduate":
			return "graduate";
		case "postgraduate":
			return "graduate";
		default:
			return "student";
	}
}

export function encryptString(str: string, key: string) {
	const ciphertext = cryptoJS.AES.encrypt(str, key).toString();
	console.log(ciphertext);
	return ciphertext;
}

export function decryptString(str: string, key: string) {
	console.log(str);
	const bytes = cryptoJS.AES.decrypt(str, key);
	const originalText = bytes.toString(cryptoJS.enc.Utf8);
	console.log(originalText);
	return originalText;
}
