/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FFDFE8',
          100: '#FFA6C1',
          200: '#FE5F9C',
          300: '#E2007B',
          400: '#A60054',
          500: '#660033',
          600: '#2F0014',
        },
        'pink-alt': {
          50: '#F9E2EB',
          100: '#EFA6CA',
          200: '#E673AC',
          300: '#C54389',
          400: '#8D2D01',
          500: '#58193B',
          600: '#290719',
        },
        green: {
          50: '#CBFFBB',
          100: '#73E920',
          200: '#5CB819',
          300: '#46911D',
          400: '#316909',
          500: '#1D4403',
          600: '#0B2201',
        },
        'green-alt': {
          50: '#00FB34',
          100: '#00CE29',
          200: '#00A21E',
          300: '#007914',
          400: '#00520A',
          500: '#002E03',
          600: '#001501',
        },
        grey: {
          50: '#E9E7E8',
          100: '#C3BFBF',
          200: '#A09799',
          300: '#7C7274',
          400: '#575051',
          500: '#353031',
          600: '#161313',
        },
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
        editorial: ['Spectral', 'Georgia', 'serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}