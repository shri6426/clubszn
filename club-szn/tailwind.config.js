/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'szn-black': '#050505',
        'szn-cream': '#F0EBDD',
        'szn-magenta': '#D000FF',
        'szn-violet': '#8316C8',
        'szn-white': '#FFFFFF',
        'szn-charcoal': '#171717',
      },
      fontFamily: {
        'anton': ['Anton', 'sans-serif'],
        'bebas': ['Bebas Neue', 'sans-serif'],
        'instrument': ['Instrument Serif', 'serif'],
        'grotesk': ['Space Grotesk', 'sans-serif'],
        'dm': ['DM Sans', 'sans-serif'],
      },
      letterSpacing: {
        'tightest': '-0.05em',
        'ultrawide': '0.3em',
      },
      animation: {
        'marquee': 'marquee 20s linear infinite',
        'marquee-reverse': 'marquee-reverse 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-magenta': 'pulse-magenta 2s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-magenta': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
