/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",              // 👈 add this
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          600: "#1E40AF",
          700: "#1E3A8A",
        },
        green: {
          600: "#059669",
          700: "#047857",
        },
        red: {
          500: "#EF4444",
          600: "#DC2626",
        },
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
