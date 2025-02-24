/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#000000',
        'cyber-dark': '#0a0a0a',
        'cyber-blue': '#00f0ff',
        'cyber-green': '#00ff9f',
        'cyber-text': '#e0e0e0',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 