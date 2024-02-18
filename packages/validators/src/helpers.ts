export function formatString(str: string | undefined) {
	if (!str) return "";
	return str
		.replace(/[-_]/g, " ")
		.replace(/\b\w/g, l => l.toUpperCase())
		.replace(/'(\w)/g, (_, letter) => "'" + letter.toLowerCase());
}
