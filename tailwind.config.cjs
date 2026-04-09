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
        body:    ["var(--font-body)"],
      },
      colors: {
        bg:      "rgb(var(--bg))",
        panel:   "rgb(var(--panel))",
        panel2:  "rgb(var(--panel2))",
        gold:    "rgb(var(--gold))",
        neon:    "rgb(var(--neon))",
        lime:    "rgb(var(--lime))",
        cream:   "rgb(var(--cream))",
        rust:    "rgb(var(--rust))",
        // Legacy — admin only
        sand:    "rgb(var(--sand))",
        ink:     "rgb(var(--ink))",
        green900:"rgb(var(--g900))",
        green700:"rgb(var(--g700))",
        green500:"rgb(var(--g500))",
        // Aliases used in existing admin components
        dark:    "rgb(var(--bg))",
        surface: "rgb(var(--panel))",
        surface2:"rgb(var(--panel2))",
        purple:  "#9B2FC9",
      },
      boxShadow: {
        soft:   "0 10px 30px rgba(0,0,0,.25)",
        neon:   "0 0 24px rgba(76,194,29,0.5), 0 0 48px rgba(76,194,29,0.15)",
        gold:   "0 0 24px rgba(232,196,52,0.5), 0 0 48px rgba(232,196,52,0.15)",
        card:   "0 4px 32px rgba(0,0,0,0.6)",
        panel:  "0 0 0 2px rgba(76,194,29,0.2), 0 8px 32px rgba(0,0,0,0.5)",
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
