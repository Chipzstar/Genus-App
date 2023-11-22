/** @type {import("prettier").Config} */
module.exports = {
  arrowParens: "avoid",
  printWidth: 120,
  singleQuote: true,
  jsxSingleQuote: true,
  semi: true,
  trailingComma: "none",
  tabWidth: 4,
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  tailwindConfig: "./packages/config/tailwind",
};
