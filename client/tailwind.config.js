/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'qm': {
          "50": "#E4E8EF",
          "100": "#C9D1E0",
          "200": "#AEBBD0",
          "300": "#93A4C1",
          "400": "#798DB1",
          "500": "#436092",
          "600": "#284983",
          "700": "#0D3273",
          "800": "#05122A",
          "900": "#020915",
          "950": "#01050B",
        }
      }
    },
  },
  plugins: [],
}
