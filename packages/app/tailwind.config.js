const colors = require('tailwindcss/colors');

module.exports = {
  purge: {
    // uncomment out to enable purge functionality on development environment.
    // enabled: true,
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
  },
  darkMode: 'media',
  theme: {
    screens: {
      lg: '640px',
    },
    // Utilities by a-z order.
    extend: {
      colors: {
        primary: {
          l: 'var(--color-primary-l)',
          d: 'var(--color-primary-d)',
        },
        secondary: {
          l: 'var(--color-secondary-l)',
          d: 'var(--color-secondary-d)',
        },
        tertiary: {
          l: 'var(--color-tertiary-l)',
          d: 'var(--color-tertiary-d)',
        },
        // These colors are meant to be used only by the global.css to construct all color themes using the tailwind's theme directive, `theme('colors.palette.xxx')`.
        palette: colors,
      },
      fontSize: {
        xxs: ['0.625rem', '1rem'],
      },
      maxHeight: {
        '25%': '25%',
        '50%': '50%',
        '75%': '75%',
      },
      maxWidth: {
        '25%': '25%',
        '50%': '50%',
        '75%': '75%',
      },
      minHeight: {
        '25%': '25%',
        '50%': '50%',
        '75%': '75%',
      },
      minWidth: {
        '25%': '25%',
        '50%': '50%',
        '75%': '75%',
      },
    },
  },
  variants: {
    extend: {
      margin: ['last'],
    },
  },
  plugins: [],
};
