/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold:     '#B8860B',
        daagold:  '#DAA520',
        primary:  '#fece51',
        primary2: '#f0b400',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        poppins:  ['Poppins', 'sans-serif'],
        lato:     ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

