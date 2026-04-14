/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        umak: {
          // Primary Blue (Space Cadet)
          blue: {
            DEFAULT: '#111c4e',
            50: '#47528a',
            100: '#28336b',
            200: '#060e33',
            300: '#01061c',
          },
          // Primary Yellow (Maximum Yellow)
          yellow: {
            DEFAULT: '#f5ec3a',
            50: '#fff989',
            100: '#fef760',
          },
          // Secondary Blue (Silver Lake Blue)
          'blue-2': {
            DEFAULT: '#105389',
            50: '#c0d5f0',
            100: '#8bb0dc',
            200: '#406fa5',
            300: '#275996',
          },
          // Graphics & Accent Colors
          navy: '#001478',
          sky: '#497ccf',
          red: '#FF0000',
          'dark-navy': '#020727',
          white: '#ffffff',
        },
      },
      fontFamily: {
        marcellus: ['Marcellus', 'serif'],
        metropolis: ['Metropolis', 'sans-serif'],
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': {
            textShadow:
              '0 0 10px #f5ec3a, 0 0 20px #f5ec3a, 0 0 40px #f5ec3a, 0 0 80px #f5ec3a',
          },
          '50%': {
            textShadow:
              '0 0 5px #f5ec3a, 0 0 10px #f5ec3a, 0 0 20px #f5ec3a',
          },
        },
        'glow-flicker': {
          '0%': {
            textShadow: '0 0 2px rgba(255,255,255,0.3)',
            opacity: '0.5',
          },
          '8%': {
            textShadow:
              '0 0 10px #ffffff, 0 0 30px rgba(255,255,255,0.7), 0 0 60px rgba(255,255,255,0.4)',
            opacity: '1',
          },
          '12%': {
            textShadow: '0 0 2px rgba(255,255,255,0.4)',
            opacity: '0.6',
          },
          '18%': {
            textShadow:
              '0 0 10px #ffffff, 0 0 30px rgba(255,255,255,0.7), 0 0 60px rgba(255,255,255,0.4)',
            opacity: '1',
          },
          '22%': {
            textShadow: '0 0 3px rgba(255,255,255,0.3)',
            opacity: '0.55',
          },
          '30%': {
            textShadow:
              '0 0 10px #ffffff, 0 0 30px rgba(255,255,255,0.7), 0 0 60px rgba(255,255,255,0.4)',
            opacity: '1',
          },
          '35%': {
            textShadow: '0 0 2px rgba(255,255,255,0.4)',
            opacity: '0.7',
          },
          '45%': {
            textShadow:
              '0 0 10px #ffffff, 0 0 30px rgba(255,255,255,0.7), 0 0 60px rgba(255,255,255,0.4)',
            opacity: '1',
          },
          '50%': {
            textShadow: '0 0 4px rgba(255,255,255,0.5)',
            opacity: '0.8',
          },
          '60%, 100%': {
            textShadow:
              '0 0 10px #ffffff, 0 0 30px rgba(255,255,255,0.7), 0 0 60px rgba(255,255,255,0.4), 0 0 100px rgba(255,255,255,0.2)',
            opacity: '1',
          },
        },
        'scroll-photos': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'glow-flicker': 'glow-flicker 5s ease-in-out 1 forwards',
        'scroll-photos': 'scroll-photos 30s linear infinite',
      },
    },
  },
  plugins: [],
}
