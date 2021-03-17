const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],

  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      gray: colors.gray,
      red: colors.red,
      lime: colors.lime,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
