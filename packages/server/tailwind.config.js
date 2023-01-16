/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,css,ejs}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
