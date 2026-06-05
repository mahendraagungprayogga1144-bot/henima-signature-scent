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
          50: "#faf8f3",
          100: "#f5f0e8",
          200: "#ebe0cc",
          300: "#d4c4a0",
          400: "#b89e72",
          500: "#8a7355",
          600: "#6b5840",
          700: "#4e3f2e",
          800: "#2e2418",
          900: "#1a1510",
          950: "#0f0d09",
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
