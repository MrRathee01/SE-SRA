/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#e1e9f2',
          200: '#c3d3e6',
          300: '#95b3d4',
          400: '#628ebd',
          500: '#3f70a5',
          600: '#2f5789',
          700: '#274770',
          800: '#1e3757',
          900: '#0f1d30',
          950: '#09121f',
        },
        risk: {
          safe: {
            bg: '#ecfdf5',
            text: '#065f46',
            border: '#a7f3d0',
            badge: '#10b981'
          },
          warning: {
            bg: '#fffbeb',
            text: '#92400e',
            border: '#fde68a',
            badge: '#f59e0b'
          },
          critical: {
            bg: '#fef2f2',
            text: '#991b1b',
            border: '#fecaca',
            badge: '#ef4444'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

