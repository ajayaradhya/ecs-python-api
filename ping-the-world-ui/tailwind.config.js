/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        terminal: "#0a0a0a",
        termborder: "#131313",
        neon: "#39ff14",
        neonAlt: "#6bff73",
        cyanBright: "#08F7FE",
        magenta: "#FE53BB",
        warning: "#ff4d4d",
      },
      fontFamily: {
        mono: ["'Fira Code'", "monospace"],
      },
    },
  },
  plugins: [],
};
