import type { Config } from "tailwindcss";

import base from "./index";

export default {
	content: base.content,
	presets: [base],
	theme: {}
} satisfies Config;
