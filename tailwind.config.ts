import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jost)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
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
          50: "#faf8f5",
          100: "#f2ede6",
          200: "#e0d5c8",
          300: "#c4b49f",
          400: "#a08c72",
          500: "#7d6a52",
          600: "#5e4f3d",
          700: "#42382c",
          800: "#2a231b",
          900: "#1a1510",
          950: "#0e0b08",
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
