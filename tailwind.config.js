/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Traditional Chinese Gold palette
        gold: {
          50: '#FFF9E6',
          100: '#FFF3CC',
          200: '#FFE799',
          300: '#FFDB66',
          400: '#FFCF33',
          500: '#D4AF37',  // Imperial Gold - primary
          600: '#B8860B',  // Deep Gold - hover
          700: '#8B6914',
          800: '#5E4A0F',
          900: '#3D2914',
        },
        // Crimson Red - prosperity, celebration
        crimson: {
          50: '#FFF0F0',
          100: '#FFD6D6',
          200: '#FFB3B3',
          300: '#FF8080',
          400: '#DC143C',
          500: '#8B0000',  // Deep crimson
          600: '#6B0000',
          700: '#4A0000',
        },
        // Rich Brown - earth, stability
        brown: {
          50: '#FAF6F1',
          100: '#F5EDE3',
          200: '#E8D9C5',
          300: '#D4C0A1',
          400: '#B39B71',
          500: '#6B4226',  // Rich brown
          600: '#5A3720',
          700: '#3D2914',
          800: '#2D1F0F',
          900: '#1A1208',
        },
        // Ivory/Cream - parchment, elegance
        ivory: {
          50: '#FFFFF8',
          100: '#FFF8DC',  // Cornsilk
          200: '#F5F0E1',  // Parchment
          300: '#EDE5D0',
          400: '#E0D5BE',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Noto Serif', 'Georgia', 'serif'],
        body: ['Open Sans', 'Noto Sans', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.3)',
        'gold-soft': '0 4px 14px rgba(212, 175, 55, 0.15)',
        'gold-md': '0 4px 6px -1px rgba(212, 175, 55, 0.1), 0 2px 4px -1px rgba(212, 175, 55, 0.06)',
      },
    },
  },
  plugins: [],
}