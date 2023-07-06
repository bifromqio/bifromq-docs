const defaultTheme = require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
    container: false,
  },
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{tsx,html}'],
  theme: {
    extend: {
      screens: {
        sm: '0px',
        lg: '997px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
