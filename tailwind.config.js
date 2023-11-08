/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      height: {
        screen: "100dvh",
      },
      colors: {
        primary: "#F21565",
        secondary: "#7908AE",
        tertiary: "#E7A06C",
      },
    },
  },
  plugins: [],
};
