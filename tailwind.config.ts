import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        bg: '#07080d',
        surface: '#141824',
        accent: '#4f8ef7',
        accent2: '#7b5ef8',
        accent3: '#3dd68c',
        warn: '#f7a94f',
        danger: '#f75454',
      },
    },
  },
  plugins: [],
}

export default config
