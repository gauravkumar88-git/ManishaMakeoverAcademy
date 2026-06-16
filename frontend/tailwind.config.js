/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rose: {
          gold: '#B76E79',
          light: '#FFE4E6',
        },
        beauty: {
          50:  '#FFF0F6',
          100: '#FFD6E8',
          200: '#FFACD2',
          300: '#FF7BBD',
          400: '#FF4DA6',
          500: '#E91E8C',
          600: '#C2185B',
          700: '#9C1A50',
          800: '#7A1040',
          900: '#560A2C',
        },
        purple: {
          beauty: '#7B2D8B',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1a0010 0%, #3d0030 40%, #1a0020 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(233,30,140,0.1) 0%, rgba(123,45,139,0.1) 100%)',
        'gold-gradient': 'linear-gradient(135deg, #B76E79 0%, #E8C99A 50%, #B76E79 100%)',
        'pink-gradient': 'linear-gradient(135deg, #E91E8C 0%, #9C27B0 100%)',
      },
      boxShadow: {
        'beauty': '0 8px 32px rgba(233, 30, 140, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.12)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
