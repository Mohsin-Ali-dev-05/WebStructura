/**
 * WebStructura design tokens — Tailwind-compatible theme extension.
 * The app mirrors these utilities in src/styles/index.css (no Tailwind CLI build).
 * Keep this file as the source of truth when adding tokens.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#F8FAF9',
        'brand-text': '#0F172A',
      },
      boxShadow: {
        soft: '0 20px 40px -15px rgba(0, 0, 0, 0.05), 0 8px 16px -8px rgba(0, 0, 0, 0.04)',
      },
      letterSpacing: {
        tight: '-0.025em',
      },
      lineHeight: {
        relaxed: '1.7',
      },
      backgroundColor: {
        canvas: '#FAFAFA',
      },
    },
  },
  plugins: [],
};
