/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#252B42",
        muted: "#737373",
        brand: "#23A6F0",
        success: "#2DC071",
        danger: "#E74040",
        paper: "#FAFAFA",
      },
      fontFamily: {
        sans: ["Montserrat", "Inter", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
