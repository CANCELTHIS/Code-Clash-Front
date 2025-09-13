/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#F2F2F2',
        accent: '#EAE4D5',
        muted: '#B6B09F'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}