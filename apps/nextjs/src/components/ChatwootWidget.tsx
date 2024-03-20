import type React from "react";
import { useEffect } from "react";

interface Props {
	token: string;
}

const ChatwootWidget: React.FC<Props> = ({ token }: Props) => {
	useEffect(() => {
		// Add Chatwoot Settings
		(window as any).chatwootSettings = {
			hideMessageBubble: false,
			position: "right", // This can be left or right
			locale: "en", // Language to be set
			type: "standard", // [standard, expanded_bubble]
			launcherTitle: "Chat with us"
		};

		// Paste the script from inbox settings except the <script> tag
		(function (d: Document, t: string) {
			var BASE_URL = "https://app.chatwoot.com";
			var g = d.createElement(t),
				s = d.getElementsByTagName(t)[0];
			g.src = BASE_URL + "/packs/js/sdk.js";
			s.parentNode!.insertBefore(g, s);
			g.async = true;
			g.onload = function () {
				(window as any).chatwootSDK.run({
					websiteToken: token,
					baseUrl: BASE_URL
				});
				if (window.innerWidth < 480) {
					window.$chatwoot.toggleBubbleVisibility("hide");
				}
			};
		})(document, "script");
	}, []); // An empty array means that this effect will run once when the component mounts.

	return null;
};

export default ChatwootWidget;
