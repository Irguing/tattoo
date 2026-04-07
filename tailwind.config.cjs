/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      colors: {
        // Dark theme
        dark:     "rgb(var(--dark))",
        surface:  "rgb(var(--surface))",
        surface2: "rgb(var(--surface2))",
        cream:    "rgb(var(--cream))",
        neon:     "rgb(var(--neon))",
        purple:   "rgb(var(--purple))",
        gold:     "rgb(var(--gold))",
        rust:     "rgb(var(--rust))",
        // Legacy (admin / light UI)
        sand:     "rgb(var(--sand))",
        ink:      "rgb(var(--ink))",
        green900: "rgb(var(--g900))",
        green700: "rgb(var(--g700))",
        green500: "rgb(var(--g500))",
      },
      boxShadow: {
        soft:   "0 10px 30px rgba(0,0,0,.18)",
        neon:   "0 0 24px rgba(76,194,29,0.45), 0 0 48px rgba(76,194,29,0.15)",
        purple: "0 0 24px rgba(155,47,201,0.45), 0 0 48px rgba(155,47,201,0.15)",
        gold:   "0 0 24px rgba(232,160,32,0.45), 0 0 48px rgba(232,160,32,0.15)",
        card:   "0 4px 24px rgba(0,0,0,0.4)",
      },
      borderRadius: {
        xl:  "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};
