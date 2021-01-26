module.exports = {
  purge: {
    // uncomment out to enable purge functionality on development environment.
    // enabled: true,
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
  },
  darkMode: false,
  theme: {
    // Utilities by a-z order.
    extend: {
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
    extend: {},
  },
  plugins: [],
};
