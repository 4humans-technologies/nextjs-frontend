module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  variants: {
    transitionProperty: ["responsive"],
  },
  theme: {
    extend: {
      screens: {
        // prettier-ignore
        "sm": "640px",
        // prettier-ignore
        "md": "780px",
        // prettier-ignore
        "lg": "1024px",
        // prettier-ignore
        "xl": "1280px",
        // prettier-ignore
        "2xl": "1536px",
      },
      colors: {
        "first-color": "#232323", // #header
        "dark-black": "#1C1C1C", // #dark black
        "second-color": "#303133", // #gray
        "third-color": "#141415", // #sidebar gray
        "white-color": "#F1F1F1", // #white color
        "green-color": "#00B649", // #green color
        "text-black": "#747474",
        "dark-background": "#000000", // #dark background
        "dreamgirl-red": "#FD1E47",
      },
      fontFamily: {
        sans: ["PT sans", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  prefix: "tw-",
}
