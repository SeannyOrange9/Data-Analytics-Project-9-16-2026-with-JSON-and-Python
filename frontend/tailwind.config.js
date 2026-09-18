/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bce0ff',
          300: '#8eccff',
          400: '#59afff',
          500: '#338cff',
          600: '#1d6cf5',
          700: '#1656e1',
          800: '#1946b6',
          900: '#1a3e8f',
          950: '#152757',
        },
        danger: {
          50: '#fff1f2',
          100: '#ffe1e3',
          200: '#ffc7cc',
          300: '#ffa0a8',
          400: '#ff6b78',
          500: '#f93d4f',
          600: '#e61f3f',
          700: '#c11230',
          800: '#a1132e',
          900: '#89152d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};