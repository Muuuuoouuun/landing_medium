/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#020f08',
          900: '#0a1f17',
          800: '#0d2b1e',
          700: '#0d6e4b',
          600: '#0f8a5e',
          500: '#10b981',
          400: '#34d399',
          200: '#a7f3d0',
          100: '#d1fae5',
          50:  '#f0fdf4',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
