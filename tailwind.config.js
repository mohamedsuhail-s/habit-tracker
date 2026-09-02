/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        capital: {
          bg: '#0E0E10',
          surface: '#18181C',
          'surface-card': '#212126',
          primary: '#818CF8',
          'primary-hover': '#6366F1',
          accent: '#F472B6',
          border: '#27272A',
          'text-primary': '#FFFFFF',
          'text-secondary': '#A1A1AA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        control: '8px',
        pill: '9999px',
      }
    },
  },
  plugins: [],
}
