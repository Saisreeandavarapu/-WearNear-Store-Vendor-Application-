/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#172B82',
          'blue-secondary': '#243FBA',
          'blue-bright': '#3155D8',
          'blue-light': '#EEF2FF',
          'blue-subtle': '#E0E7FE',
          cream: '#F5F0E6',
          'cream-surface': '#FFFCF5',
          'cream-dark': '#EBE4D5',
          border: '#DDD7CA',
          'border-light': '#ECE7DE',
          text: '#172033',
          muted: '#687085',
          'muted-light': '#949BA8',
          success: '#16A34A',
          'success-bg': '#ECFDF5',
          warning: '#F59E0B',
          'warning-bg': '#FFFBEB',
          error: '#DC2626',
          'error-bg': '#FEF2F2',
          info: '#3155D8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(23, 43, 130, 0.04), 0 1px 2px rgba(23, 43, 130, 0.02)',
        'card': '0 2px 8px -2px rgba(23, 43, 130, 0.06), 0 1px 4px -1px rgba(23, 43, 130, 0.03)',
        'card-hover': '0 8px 24px -4px rgba(23, 43, 130, 0.1), 0 2px 6px -1px rgba(23, 43, 130, 0.05)',
        'modal': '0 20px 40px -12px rgba(23, 43, 130, 0.25)',
        'bottom-nav': '0 -4px 16px rgba(23, 43, 130, 0.06)',
        'sheet': '0 -8px 30px rgba(23, 43, 130, 0.15)',
      }
    },
  },
  plugins: [],
}
