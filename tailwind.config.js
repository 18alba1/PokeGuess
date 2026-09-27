/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a1024',
          900: '#0f1838',
          800: '#1a2a52',
          700: '#243a6b',
          600: '#344d8a',
        },
        poke: {
          red: '#ee1515',
          'red-dark': '#c00d0d',
          yellow: '#ffcb05',
          'yellow-dark': '#e0ac00',
          blue: '#3b6dfa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'reveal-pop': 'revealPop 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'bounce-slow': 'bounceSlow 1.2s ease-in-out infinite',
        'spin-slow': 'spin 1.2s linear infinite',
      },
      keyframes: {
        revealPop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
