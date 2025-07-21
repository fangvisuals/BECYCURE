/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'space-grotesk': ['"Space Grotesk"', 'sans-serif'],
        'inter': ['"Inter"', 'sans-serif']
      },
      backgroundImage: {
        'techno-gradient': 'linear-gradient(90deg, #0ff 0%, #a259ff 50%, #0ff 100%)',
      },
      // Pour une animation de gradient personnalisée (optionnel)
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'gradient-move': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
      animation: {
        blink: 'blink 0.5s infinite',
        fade: 'blink 3s infinite',
        'gradient-move': 'gradient-move 2s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        blink: 'blink 0.5s infinite',
        fade: 'blink 3s infinite'
      },
    },
  },
  plugins: [],
};