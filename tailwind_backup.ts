/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0F62FE',
          50: '#EBF1FF',
          100: '#DBE1FF',
          200: '#B6C4FF',
          300: '#7B96FF',
          400: '#4A70FF',
          500: '#0F62FE',
          600: '#0047D6',
          700: '#0035A3',
          800: '#002470',
          900: '#00123D',
        },
        secondary: {
          DEFAULT: '#5E5066',
          50: '#F5F2F7',
          100: '#EAE6EE',
          200: '#D5CCDD',
          300: '#B6A9C1',
          400: '#8F7F9B',
          500: '#5E5066',
          600: '#4A3E52',
          700: '#362D3D',
          800: '#221B27',
          900: '#0E0A11',
        },
        surface: {
          DEFAULT: '#FCF9F8',
          var: '#E5E2E1',
        },
        error: {
          DEFAULT: '#BA1A1A',
          light: '#FFDAD6',
        },
        warning: {
          DEFAULT: '#E6720A',
          light: '#FFF0E0',
        },
        success: {
          DEFAULT: '#1B7A3E',
          light: '#C8F0D4',
        },
        alert: {
          DEFAULT: '#963180',
          light: '#FFD7F5',
        },
        border: '#C3C6D8',
        sidebar: '#FCF9F8',
      },
      boxShadow: {
        card: '0px 1px 3px 0px rgba(0,0,0,0.10), 0px 1px 2px -1px rgba(0,0,0,0.10)',
        elevated: '0px 4px 6px -4px rgba(0,0,0,0.10), 0px 10px 15px -3px rgba(0,0,0,0.10)',
        fab: '0px 25px 50px -12px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
};
