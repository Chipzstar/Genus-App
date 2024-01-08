import type {Config} from "tailwindcss";
import baseConfig from "@genus/tailwind-config";
import {nextui} from "@nextui-org/react";
import { withUt } from "uploadthing/tw";

export default withUt({
    content: [
        ...baseConfig.content,
        "../../packages/ui/src/**/*.{ts,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
    ],
    presets: [baseConfig],
    darkMode: "class",
    plugins: [nextui({
        prefix: "nextui", // prefix for themes variables
        addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
        defaultTheme: "light", // default theme from the themes object
        defaultExtendTheme: "light", // default theme to extend on custom themes
        layout: {}, // common layout tokens (applied to all themes)
        themes: {
            light: {
                layout: {}, // light theme layout tokens
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
                        900: "#000000"
                    },
                    secondary: {
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
                        900: "#043631"
                    },
                }, // light theme colors
            },
            dark: {
                layout: {}, // dark theme layout tokens
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
                        900: "#000000"
                    },
                    secondary: {
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
                        900: "#043631"
                    },
                }, // dark theme colors
            },

        }
    })],
}) satisfies Config;
