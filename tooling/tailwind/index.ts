import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./containers/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}"
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))"
			},
			fontSize: {
				h1: ["2.5rem", { lineHeight: "2.5rem" }],
				h2: ["2rem", { lineHeight: "2rem" }],
				h3: ["1.75rem", { lineHeight: "1.75rem" }],
				h4: ["1.5rem", { lineHeight: "1.5rem" }],
				h5: ["1.25rem", { lineHeight: "1.25rem" }],
				h6: ["1rem", { lineHeight: "1rem" }],
				xxs: ["0.5rem", { lineHeight: "1rem" }],
				"2.5xl": ["1.688rem", { lineHeight: "2.125rem" }]
			},
			fontFamily: {
				sans: ["var(--font-sans)", ...fontFamily.sans]
			},
			width: {
				76: "19rem",
				120: "30rem",
				128: "32rem",
				144: "36rem",
				160: "40rem",
				176: "44rem",
				192: "48rem",
				208: "52rem"
			},
			height: {
				76: "19rem",
				120: "30rem",
				128: "32rem",
				144: "36rem",
				160: "40rem",
				176: "44rem",
				192: "48rem",
				208: "52rem"
			},
			maxHeight: {
				76: "19rem",
				120: "30rem",
				128: "32rem",
				144: "36rem",
				160: "40rem",
				176: "44rem",
				192: "48rem",
				208: "52rem"
			},
			colors: {
				primary: {
					DEFAULT: "#2AA6B7",
					50: "#ADE4EC",
					100: "#9CDFE8",
					200: "#7BD4E1",
					300: "#5ACAD9",
					400: "#38BFD1",
					500: "#2AA6B7",
					600: "#207D89",
					700: "#15535C",
					800: "#0B2A2E",
					900: "#000000",
					950: "#000000"
				},
				secondary: {
					DEFAULT: "#B07DE1",
					50: "#FFFFFF",
					100: "#FFFFFF",
					200: "#ECE0F8",
					300: "#D8BFF0",
					400: "#C49EE9",
					500: "#B07DE1",
					600: "#944FD6",
					700: "#782DC1",
					800: "#5C2294",
					900: "#401866",
					950: "#31124F"
				},
				tertiary: {
					DEFAULT: "#F1948A",
					50: "#FFFFFF",
					100: "#FFFFFF",
					200: "#FEF8F7",
					300: "#FAD7D3",
					400: "#F5B5AE",
					500: "#F1948A",
					600: "#EB6658",
					700: "#E53826",
					800: "#BC2717",
					900: "#8A1C11",
					950: "#71170E"
				},
				button: {
					DEFAULT: "#2CEFD8",
					50: "#D7FCF8",
					100: "#C4FBF4",
					200: "#9EF8ED",
					300: "#78F5E6",
					400: "#52F2DF",
					500: "#2CEFD8",
					600: "#10D3BC",
					700: "#0C9F8D",
					800: "#086B5F",
					900: "#043631",
					950: "#021C19"
				},
				"chat-bubble-external": {
					DEFAULT: "#6ECCDD",
					50: "#FFFFFF",
					100: "#F2FAFC",
					200: "#D1EFF4",
					300: "#B0E3EC",
					400: "#8FD8E5",
					500: "#6ECCDD",
					600: "#41BCD2",
					700: "#2A9CB1",
					800: "#1F7484",
					900: "#144C56",
					950: "#0F3840"
				},
				"chat-bubble-internal": {
					DEFAULT: "#B07DE1",
					50: "#FFFFFF",
					100: "#FFFFFF",
					200: "#ECE0F8",
					300: "#D8BFF0",
					400: "#C49EE9",
					500: "#B07DE1",
					600: "#944FD6",
					700: "#782DC1",
					800: "#5C2294",
					900: "#401866",
					950: "#31124F"
				},
				"stepper-icon": {
					DEFAULT: "#9EF3E9",
					50: "#FFFFFF",
					100: "#FFFFFF",
					200: "#FFFFFF",
					300: "#E7FCF9",
					400: "#C2F7F1",
					500: "#9EF3E9",
					600: "#6CEDDE",
					700: "#3AE7D2",
					800: "#1ACFBA",
					900: "#139D8D",
					950: "#108477"
				},
				back: {
					DEFAULT: "#95979D",
					50: "#F4F5F5",
					100: "#EAEAEB",
					200: "#D5D5D8",
					300: "#BFC1C4",
					400: "#AAACB1",
					500: "#95979D",
					600: "#787B82",
					700: "#5D5F65",
					800: "#424448",
					900: "#27282A",
					950: "#1A1A1C"
				},
				success: {
					DEFAULT: "#56BA0D",
					50: "#B7F788",
					100: "#ABF575",
					200: "#94F34F",
					300: "#7DF029",
					400: "#68E010",
					500: "#56BA0D",
					600: "#3E8609",
					700: "#265106",
					800: "#0D1D02",
					900: "#000000",
					950: "#000000"
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				/*primary: {
						  DEFAULT: "hsl(var(--primary))",
						  foreground: "hsl(var(--primary-foreground))",
						},
						secondary: {
						  DEFAULT: "hsl(var(--secondary))",
						  foreground: "hsl(var(--secondary-foreground))",
						},*/
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))"
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))"
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))"
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))"
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))"
				}
			},
			borderRadius: {
				lg: `var(--radius)`,
				md: `calc(var(--radius) - 2px)`,
				sm: "calc(var(--radius) - 4px)"
			},
			keyframes: {
				"caret-blink": {
					"0%,70%,100%": { opacity: "1" },
					"20%,50%": { opacity: "0" }
				},
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" }
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" }
				}
			},
			animation: {
				"caret-blink": "caret-blink 1.2s ease-out infinite",
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out"
			}
		}
	},
	plugins: [require("tailwindcss-animate")]
} satisfies Config;
