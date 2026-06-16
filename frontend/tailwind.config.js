/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        elara: {
          black: '#060606',
          dark: '#1a1a1a',
          card: '#222222',
          border: '#333333',
          muted: '#666666',
          gray: '#999999',
          light: '#cccccc',
          white: '#f5f5f0',
        },
        // Old vanta colors (backward compatibility)
        vanta: {
          black: '#060606',
          dark: '#1a1a1a',
          card: '#222222',
          border: '#333333',
          muted: '#666666',
          gray: '#999999',
          light: '#cccccc',
          white: '#f5f5f0',
        },
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};