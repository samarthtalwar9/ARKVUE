/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#08051c',
          900: '#0d0828',
          800: '#140b3b',
          700: '#1d1250',
          600: '#2a1a6e',
        },
        brand: {
          50: '#f6f2ff',
          100: '#ede5ff',
          200: '#dacdff',
          300: '#c0aaff',
          400: '#a07dff',
          500: '#7c4dea',
          600: '#5b2dde',
          700: '#4a22be',
          800: '#3a1b94',
        },
        lavender: '#f4f0ff',
      },
      boxShadow: {
        soft: '0 8px 30px -12px rgba(76, 29, 149, 0.18)',
        lift: '0 18px 40px -14px rgba(91, 45, 222, 0.32)',
        glow: '0 0 0 1px rgba(124, 77, 234, 0.25), 0 18px 44px -12px rgba(124, 77, 234, 0.45)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
}
