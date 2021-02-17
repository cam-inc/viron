module.exports = {
  purge: {
    // uncomment out to enable purge functionality on development environment.
    // enabled: true,
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
  },
  darkMode: false,
  theme: {
    screens: {
      lg: '640px',
    },
    // Utilities by a-z order.
    extend: {
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
