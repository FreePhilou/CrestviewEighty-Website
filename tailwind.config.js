/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2c5aa0',
          700: '#1e3d72',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 800\"><rect fill=\"%23064e3b\" width=\"1200\" height=\"800\"/><path fill=\"%23065f46\" d=\"M0 400l50-16.7C100 367 200 333 300 350s200 83 300 83 200-66 300-83 200 17 250 25l50 8.3V800H0z\"/><path fill=\"%23047857\" d=\"M0 500l50-8.3C100 483 200 467 300 467s200 17 300 33 200 17 300 0 200-50 250-58.3L1200 433V800H0z\"/></svg>')"
      }
    },
  },
  plugins: [],
}