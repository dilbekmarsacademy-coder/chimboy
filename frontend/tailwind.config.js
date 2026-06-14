/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D32F2F',
          dark: '#B71C1C',
        },
        accent: '#FF6F00',
        success: '#2E7D32',
        warning: '#F57F17',
        danger: '#C62828',
        bg: '#F5F5F5',
        surface: '#FFFFFF',
        text: '#212121',
        muted: '#757575',
      },
      fontFamily: {
        sans: ['Poppins', 'Golos Text', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.08)',
        cardHover: '0 8px 24px -4px rgba(0,0,0,0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease forwards',
        marquee: 'marquee 20s linear infinite',
      },
    },
  },
  plugins: [],
};
