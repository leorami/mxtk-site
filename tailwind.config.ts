import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // neutrals
        border: 'hsl(215 16% 85%)',
        muted: '#5B6572',
        ink: '#0E1116',
        // brand palette
        brand: {
          orange: '#E0932B',
          navy: '#0B1C4A',
          teal: '#0FBF9F',
          copper: '#C97E3D',
          border: '#E5E9F0',
          ink: '#0E1116',
        },
        // dark tokens
        dark: {
          bg: '#0B0E12',
          surface: '#12161C',
          border: '#1E2430',
          ink: '#E6EAF2',
          muted: '#9AA3AE',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        'lift-sm': '0 8px 20px -12px rgba(0,0,0,.18), 0 4px 10px -6px rgba(0,0,0,.12)',
        lift: '0 16px 42px -20px rgba(0,0,0,.22), 0 8px 18px -10px rgba(0,0,0,.14)',
        'inner-top': 'inset 0 1px 0 rgba(255,255,255,.35)',
      },
      backdropBlur: { xs: '2px' },
      transitionTimingFunction: { 'out-soft': 'cubic-bezier(.22,.61,.36,1)' },
    },
  },
  plugins: [],
}

export default config
