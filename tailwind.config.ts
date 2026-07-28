import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#1652f0", // Vibrant electric blue
          600: "#0d5be1", // Signature royal blue (matches left side of theme)
          700: "#0052cc", // Deep royal blue
          800: "#093285", // Dark blue
          900: "#0a192f", // Corporate navy header
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          500: "#ff6b00", // Signature vibrant orange (matches right side of theme)
          600: "#f26522", // Deep energetic orange
          700: "#ea580c",
          800: "#c2410c",
          900: "#7c2d12",
        },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          800: "#1e293b",
          900: "#0f172a",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
