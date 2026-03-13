/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        sentinel: {
          bg: '#080c12',
          surface: '#0d1520',
          card: '#111a27',
          border: '#1a2840',
          online: '#00ff88',
          offline: '#ff3355',
          accent: '#4d9fff',
          muted: '#4a6080',
          text: '#c8dff0',
        },
      },
      animation: {
        'pulse-green': 'pulse-green 2s ease-in-out infinite',
        'pulse-red': 'pulse-red 1s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 8px 2px #00ff8866' },
          '50%': { boxShadow: '0 0 24px 8px #00ff8899' },
        },
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 8px 2px #ff335566' },
          '50%': { boxShadow: '0 0 24px 10px #ff335599' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
      },
    },
  },
  plugins: [],
}
