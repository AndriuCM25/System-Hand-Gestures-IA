/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00d9ff',
          50: '#e6f9ff',
          100: '#ccf3ff',
          200: '#99e7ff',
          300: '#66dbff',
          400: '#33cfff',
          500: '#00d9ff',
          600: '#00aecc',
          700: '#008299',
          800: '#005766',
          900: '#002b33',
        },
        secondary: '#0099ff',
        dark: '#0a0e27',
        darker: '#050816',
      },
    },
  },
  plugins: [],
}
