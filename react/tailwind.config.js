/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '15': '3.75rem', // 60px
      },
      borderWidth: {
        '3': '3px',
      },
      textShadow: {
        'default': '0 2px 4px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.text-shadow': {
          'text-shadow': theme('textShadow.default'),
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
