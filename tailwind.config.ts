import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#faf7ee",
          100: "#f3ebd2",
          200: "#e8d59c",
          300: "#d8b969",
          400: "#c79e44",
          500: "#b4872f",
          600: "#946a24",
          700: "#744f1f",
          800: "#563a1b",
          900: "#3b2716",
        },
        ink: {
          50: "#f7f7f8",
          100: "#eeeef0",
          200: "#d7d8dc",
          300: "#b6b8bf",
          400: "#8b8f9a",
          500: "#6b707e",
          600: "#545866",
          700: "#424654",
          800: "#2b2d37",
          900: "#13141a",
          950: "#0a0a0d",
        },
        gold: {
          50: "#fff9ea",
          100: "#fff0c9",
          200: "#ffe19a",
          300: "#ffcd5e",
          400: "#f7b62b",
          500: "#e09a0a",
          600: "#b87406",
          700: "#915604",
          800: "#6f4108",
          900: "#4a2a0a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
