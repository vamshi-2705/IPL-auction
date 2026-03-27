/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(15, 23, 42)',
        card: 'rgb(30, 41, 59)',
        primary: 'rgb(139, 92, 246)',
        primaryHover: 'rgb(124, 58, 237)'
      }
    },
  },
  plugins: [],
}
