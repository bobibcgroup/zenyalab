import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zenya: {
          black: '#0C0C0D',
          teal: '#0F2F3A',
          cyan: '#00D1C7',
          mint: '#A3FFE4',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { 
            textShadow: '0 0 20px rgba(0, 209, 199, 0.5), 0 0 40px rgba(163, 255, 228, 0.3)',
          },
          '50%': { 
            textShadow: '0 0 30px rgba(0, 209, 199, 0.7), 0 0 60px rgba(163, 255, 228, 0.5)',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config

