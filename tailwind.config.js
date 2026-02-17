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
        sand: "rgb(var(--sand))",
        ink: "rgb(var(--ink))",
        green900: "rgb(var(--g900))",
        green700: "rgb(var(--g700))",
        green500: "rgb(var(--g500))",
        neon: "rgb(var(--neon))",
        rust: "rgb(var(--rust))",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.12)",
      },
      borderRadius: {
        xl: "1.25rem",
      },
    },
  },
  plugins: [],
};
