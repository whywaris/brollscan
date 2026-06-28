import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dark: {
          DEFAULT: '#0A0A0F',
          50: '#16161F',
          100: '#1C1C28',
          200: '#252533',
          300: '#2E2E3F',
          400: '#3A3A4D',
        },
        violet: {
          DEFAULT: '#7C5CFC',
          50: '#F0ECFF',
          100: '#DDD5FF',
          200: '#BBA8FF',
          300: '#9A7EFF',
          400: '#7C5CFC',
          500: '#6B4AE8',
          600: '#5A38D4',
          700: '#4A28BF',
          800: '#3A1CA8',
          900: '#2A1080',
        },
        mint: {
          DEFAULT: '#3DFFB5',
          50: '#ECFFF7',
          100: '#D0FFE9',
          200: '#A0FFD4',
          300: '#6BFFC2',
          400: '#3DFFB5',
          500: '#00E690',
          600: '#00CC7F',
          700: '#00B36E',
          800: '#009A5E',
          900: '#007A4A',
        },
      },
      fontFamily: {
        heading: ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(124, 92, 252, 0.15) 0%, transparent 70%)',
        'gradient-card': 'linear-gradient(135deg, rgba(124, 92, 252, 0.08), rgba(61, 255, 181, 0.04))',
      },
      boxShadow: {
        'glow-violet': '0 0 20px rgba(124, 92, 252, 0.3)',
        'glow-mint': '0 0 20px rgba(61, 255, 181, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
