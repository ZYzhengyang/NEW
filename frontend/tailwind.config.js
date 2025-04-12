/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          400: '#FFD666',
          500: '#D4AF37', // ActorCore特有的金色
          600: '#BF9D30',
        },
        gray: {
          700: '#333333',
          800: '#222222',
          900: '#111111',
        }
      },
      width: {
        '[200px]': '200px',
      },
      height: {
        '[160px]': '160px',
        '[280px]': '280px',
      },
      animation: {
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'breathing-glow': 'breathing-glow 4s ease-in-out infinite',
        'border-flow': 'border-flow 3s linear infinite',
        'bg-shine': 'bg-shine 2.5s ease-in-out infinite alternate',
        'subtle-bounce': 'subtle-bounce 3s ease-in-out infinite',
        'sparkle': 'sparkle 6s linear infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.9 },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(212,175,55,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(212,175,55,0.6)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'breathing-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 0px rgba(212,175,55,0)', 
            borderColor: 'rgba(212,175,55,0.3)'
          },
          '50%': { 
            boxShadow: '0 0 15px rgba(212,175,55,0.5)', 
            borderColor: 'rgba(212,175,55,0.8)'
          },
        },
        'border-flow': {
          '0%, 100%': { 
            borderImage: 'linear-gradient(to right, rgba(212,175,55,0.3), rgba(212,175,55,0.8), rgba(212,175,55,0.3)) 1',
          },
          '50%': { 
            borderImage: 'linear-gradient(to right, rgba(212,175,55,0.8), rgba(212,175,55,0.3), rgba(212,175,55,0.8)) 1',
          },
        },
        'bg-shine': {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'subtle-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'sparkle': {
          '0%': { 
            backgroundImage: 'radial-gradient(rgba(212,175,55,0.1) 8%, transparent 8%)',
            backgroundPosition: '0% 0%'
          },
          '33%': { 
            backgroundImage: 'radial-gradient(rgba(212,175,55,0.2) 8%, transparent 8%)',
            backgroundPosition: '50% 50%'
          },
          '66%': { 
            backgroundImage: 'radial-gradient(rgba(212,175,55,0.1) 8%, transparent 8%)',
            backgroundPosition: '100% 0%'
          },
          '100%': { 
            backgroundImage: 'radial-gradient(rgba(212,175,55,0.0) 8%, transparent 8%)',
            backgroundPosition: '0% 100%'
          },
        },
      },
    },
  },
  plugins: [],
  // 确保Tailwind不会与Ant Design的样式冲突
  corePlugins: {
    preflight: false,
  },
} 