// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        broboard: {
          background: '#0b1220',
          primary: '#10B981',   // green-500
          secondary: '#1F2937', // gray-800
        },
      },
    },
  },
  plugins: [],
};
