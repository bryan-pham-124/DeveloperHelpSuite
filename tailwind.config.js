// tailwind.config.js
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  
    extend: {
      colors: {
          customOrange: "#fc8403",
          customBlack:  "#212121",
          customRed: "#DC3545"
      }
    }

  
  },
  plugins: [],
}