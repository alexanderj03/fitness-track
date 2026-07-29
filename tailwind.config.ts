import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF7",
        ink: "#14140F",
        line: "#D8D6CC",
        calorie: "#C97A2E",
        protein: "#3F6B3E",
        over: "#B23A2E",
      },
    },
  },
  plugins: [],
};
export default config;
