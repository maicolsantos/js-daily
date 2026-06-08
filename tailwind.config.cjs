/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0d1117',
        surface: '#161b22',
        border: '#30363d',
        muted: '#8b949e',
        easy: '#3fb950',
        medium: '#d29922',
        hard: '#f85149',
      },
    },
  },
  plugins: [],
}

