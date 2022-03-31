module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        primary: "#1C1434",
        accent: "#E2107B",
        'accent-dark': "#C1146E"
      }
    },
  },
  plugins: [require('@tailwindcss/forms')({
    strategy: 'class',
  })],
}
