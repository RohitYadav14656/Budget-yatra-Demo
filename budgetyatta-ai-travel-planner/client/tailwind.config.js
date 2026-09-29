/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'page-bg': '#F7F3EC',
        'surface': '#FFFCF7',
        'dark-text': '#20302D',
        'muted-text': '#66706C',
        'terracotta': '#E86B4A',
        'mustard': '#E4B55A',
        'border-color': '#DED8CE',
        'status-success': '#2F7D5A',
        'status-warning': '#C97719',
        'status-danger': '#B5463D',
      },
      fontFamily: {
        serif: ['Lora', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
