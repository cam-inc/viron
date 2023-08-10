/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
const COLORS = {
  'thm-primary': 'var(--thm-primary)',
  'thm-on-primary': 'var(--thm-on-primary)',
  'thm-on-primary-high': 'var(--thm-on-primary-high)',
  'thm-on-primary-low': 'var(--thm-on-primary-low)',
  'thm-on-primary-slight': 'var(--thm-on-primary-slight)',
  'thm-on-primary-faint': 'var(--thm-on-primary-faint)',
  'thm-primary-container': 'var(--thm-primary-container)',
  'thm-on-primary-container': 'var(--thm-on-primary-container)',
  'thm-on-primary-container-high': 'var(--thm-on-primary-container-high)',
  'thm-on-primary-container-low': 'var(--thm-on-primary-container-low)',
  'thm-on-primary-container-slight': 'var(--thm-on-primary-container-slight)',
  'thm-on-primary-container-faint': 'var(--thm-on-primary-container-faint)',
  'thm-secondary': 'var(--thm-secondary)',
  'thm-on-secondary': 'var(--thm-on-secondary)',
  'thm-on-secondary-high': 'var(--thm-on-secondary-high)',
  'thm-on-secondary-low': 'var(--thm-on-secondary-low)',
  'thm-on-secondary-slight': 'var(--thm-on-secondary-slight)',
  'thm-on-secondary-faint': 'var(--thm-on-secondary-faint)',
  'thm-secondary-container': 'var(--thm-secondary-container)',
  'thm-on-secondary-container': 'var(--thm-on-secondary-container)',
  'thm-on-secondary-container-high': 'var(--thm-on-secondary-container-high)',
  'thm-on-secondary-container-low': 'var(--thm-on-secondary-container-low)',
  'thm-on-secondary-container-slight':
    'var(--thm-on-secondary-container-slight)',
  'thm-on-secondary-container-faint': 'var(--thm-on-secondary-container-faint)',
  'thm-tertiary': 'var(--thm-tertiary)',
  'thm-on-tertiary': 'var(--thm-on-tertiary)',
  'thm-on-tertiary-high': 'var(--thm-on-tertiary-high)',
  'thm-on-tertiary-low': 'var(--thm-on-tertiary-low)',
  'thm-on-tertiary-slight': 'var(--thm-on-tertiary-slight)',
  'thm-on-tertiary-faint': 'var(--thm-on-tertiary-faint)',
  'thm-tertiary-container': 'var(--thm-tertiary-container)',
  'thm-on-tertiary-container': 'var(--thm-on-tertiary-container)',
  'thm-on-tertiary-container-high': 'var(--thm-on-tertiary-container-high)',
  'thm-on-tertiary-container-low': 'var(--thm-on-tertiary-container-low)',
  'thm-on-tertiary-container-slight': 'var(--thm-on-tertiary-container-slight)',
  'thm-on-tertiary-container-faint': 'var(--thm-on-tertiary-container-faint)',
  'thm-error': 'var(--thm-error)',
  'thm-on-error': 'var(--thm-on-error)',
  'thm-on-error-high': 'var(--thm-on-error-high)',
  'thm-on-error-low': 'var(--thm-on-error-low)',
  'thm-on-error-slight': 'var(--thm-on-error-slight)',
  'thm-on-error-faint': 'var(--thm-on-error-faint)',
  'thm-error-container': 'var(--thm-error-container)',
  'thm-on-error-container': 'var(--thm-on-error-container)',
  'thm-on-error-container-high': 'var(--thm-on-error-container-high)',
  'thm-on-error-container-low': 'var(--thm-on-error-container-low)',
  'thm-on-error-container-slight': 'var(--thm-on-error-container-slight)',
  'thm-on-error-container-faint': 'var(--thm-on-error-container-faint)',
  'thm-background': 'var(--thm-background)',
  'thm-on-background': 'var(--thm-on-background)',
  'thm-on-background-high': 'var(--thm-on-background-high)',
  'thm-on-background-low': 'var(--thm-on-background-low)',
  'thm-on-background-slight': 'var(--thm-on-background-slight)',
  'thm-on-background-faint': 'var(--thm-on-background-faint)',
  'thm-surface': 'var(--thm-surface)',
  'thm-on-surface': 'var(--thm-on-surface)',
  'thm-on-surface-high': 'var(--thm-on-surface-high)',
  'thm-on-surface-low': 'var(--thm-on-surface-low)',
  'thm-on-surface-slight': 'var(--thm-on-surface-slight)',
  'thm-on-surface-faint': 'var(--thm-on-surface-faint)',
  'thm-surface-variant': 'var(--thm-surface-variant)',
  'thm-on-surface-variant': 'var(--thm-on-surface-variant)',
  'thm-on-surface-variant-high': 'var(--thm-on-surface-variant-high)',
  'thm-on-surface-variant-low': 'var(--thm-on-surface-variant-low)',
  'thm-on-surface-variant-slight': 'var(--thm-on-surface-variant-slight)',
  'thm-on-surface-variant-faint': 'var(--thm-on-surface-variant-faint)',
  'thm-outline': 'var(--thm-outline)',
};

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  safelist: (function () {
    const keys = Object.keys(COLORS);
    const PREFIXES = [
      'bg',
      'hover:bg',
      'active:bg',
      'focus:bg',
      'group-hover:bg',
      'group-active:bg',
      'group-focus:bg',
      'border',
      'hover:border',
      'active:border',
      'focus:border',
      'group-hover:border',
      'group-active:border',
      'group-focus:border',
      'text',
      'hover:text',
      'active:text',
      'focus:text',
      'group-hover:text',
      'group-active:text',
      'group-focus:text',
      'ring',
      'hover:ring',
      'active:ring',
      'focus:ring',
      'group-hover:ring',
      'group-active:ring',
      'group-focus:ring',
    ];

    const safelist = [];
    PREFIXES.forEach(function (prefix) {
      keys.forEach(function (key) {
        safelist.push(`${prefix}-${key}`);
      });
    });
    return safelist;
  })(),
  theme: {
    screens: {
      lg: '640px',
    },
    // Utilities by a-z order.
    extend: {
      keyframes: {
        'move-left-and-back': {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'move-left-and-back': 'move-left-and-back 2s ease-out infinite',
      },
      colors: COLORS,
      fontSize: {
        em: '1em',
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
      spacing: {
        em: '1em',
        15: '3.75rem',
        17: '4.25rem',
        18: '4.5rem',
        19: '4.75rem',
        21: '5.25rem',
        22: '5.5rem',
        23: '5.75rem',
        25: '6.25rem',
        26: '6.5rem',
        27: '6.75rem',
        29: '7.25rem',
        30: '7.5rem',
        31: '7.75rem',
        33: '8.25rem',
        34: '8.5rem',
        35: '8.75rem',
        37: '9.25rem',
        38: '9.5rem',
        39: '9.75rem',
        41: '10.25rem',
        42: '10.5rem',
        43: '10.75rem',
        45: '11.25rem',
        46: '11.5rem',
        47: '11.75rem',
        49: '12.25rem',
        50: '12.5rem',
        51: '12.75rem',
      },
      zIndex: {
        splash: 11,
        'wrapper-progress': 10,
        'wrapper-notification': 9,
        'wrapper-popover': 8,
        'wrapper-modal': 7,
        'wrapper-drawer': 6,
        'layout-systembar': 5,
        'layout-navigation': 4,
        'layout-appbar': 3,
        'layout-subbody': 2,
        'layout-body': 1,
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
};
