import MagicBellClient, { NotificationStore } from "@magicbell/core";
import Base64 from "crypto-js/enc-base64";
import hmacSHA256 from "crypto-js/hmac-sha256";
import { ProjectClient } from "magicbell/project-client";

const apiKey = process.env.NEXT_PUBLIC_MAGICBELL_API_KEY!;
const apiSecret = process.env.MAGICBELL_SECRET_KEY!;

export const hmacEnabled = Number(process.env.MAGICBELL_HMAC_ENABLED);

export const magicbell = new ProjectClient({
	apiKey,
	apiSecret
});

export const magicBellUserClient = async (userExternalId: string, userKey = "", hmacRequired = hmacEnabled) => {
	let client;
	if (hmacRequired) {
		if (!userKey) {
			userKey = Base64.stringify(hmacSHA256(userExternalId, apiSecret));
		}
		client = await MagicBellClient.createInstance({
			apiKey,
			apiSecret,
			userExternalId,
			userKey
		});
	} else {
		client = await MagicBellClient.createInstance({
			apiKey,
			apiSecret,
			userExternalId
		});
	}
	const store = new NotificationStore();
	return {
		client,
		store
	};
};
