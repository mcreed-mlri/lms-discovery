import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mlri: {
          navy: "#082d57",
          blue: "#1669b7",
          sky: "#2a9bd6",
          ink: "#0b1f35",
          mist: "#eef5fb",
        },
      },
      boxShadow: {
        soft: "0 14px 34px rgba(8, 45, 87, 0.10)",
        lift: "0 18px 44px rgba(8, 45, 87, 0.16)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
