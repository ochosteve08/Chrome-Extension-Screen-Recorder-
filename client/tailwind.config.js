/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["DM Sans", "sans-serif"],
    },
    extend: {
      fontFamily: {
        primary: ["DM Sans", "sans-serif"],
      },
      screens: {
        xs: "540px",
      },
    },
  },
  plugins: [],
};
