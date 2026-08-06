/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // ─── Misma paleta que el proyecto DECIMA (Guía Técnica CSS) ───
        'navy-dark':   '#1a2332',
        'navy-medium': '#2c3e50',
        'primary':       '#2ecc71',
        'primary-hover': '#27ae60',
        'gold':       '#e8b341',
        'gold-hover': '#f0c44e',
        'app-bg':     '#f5f6fa',
        'danger':     '#e74c3c'
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"',
          'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'
        ]
      },
      animation: {
        'fade-in':  'fadeIn  0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          'from': { transform: 'scale(0)' },
          'to':   { transform: 'scale(1)' }
        }
      }
    }
  },
  plugins: []
}
