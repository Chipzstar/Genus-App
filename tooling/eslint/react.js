/** @type {import('eslint').Linter.Config} */
const config = {
	extends: ["plugin:react/recommended", "plugin:react-hooks/recommended"],
	rules: {
		"react/prop-types": "off"
	},
	globals: {
		React: "writable"
	},
	settings: {
		react: {
			version: "detect"
		}
	},
	env: {
		browser: true
	}
};

module.exports = config;
