// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}', // if any
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-animate')
  ],
}
