// TODO: oas.tsと共通化
const THEME = {
  RED: 'red',
  ULTIMATE_ORANGE: 'ultimate orange',
  ORANGE_JUICE: 'orange juice',
  AMBER: 'amber',
  YELLOW: 'yellow',
  LIMONCELLO: 'limoncello',
  RADIUMM: 'radium',
  HARLEQUIN: 'harlequin',
  GREEN: 'green',
  LUCENT_LIME: 'lucent lime',
  GUPPIE_GREEN: 'guppie green',
  MINTY_PARADISE: 'minty paradise',
  AQUA: 'aqua',
  CAPRI: 'capri',
  BRESCIAN_BLUE: 'brescian blue',
  RARE_BLUE: 'rare blue',
  BLUE: 'blue',
  ELECTRIC_ULTRAMARINE: 'electric ultramarine',
  VIOLENT_VIOLET: 'violent violet',
  ELECTRIC_PURPLE: 'electric purple',
  MAGENDA: 'magenta',
  BRUTAL_PINK: 'brutal pink',
  NEON_ROSE: 'neon rose',
  ELECTRIC_CRIMSON: 'electric crimson',
};

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  safelist: (function () {
    const safelist = [];
    Object.values(THEME).forEach((theme) => {
      safelist.push(`theme-${theme.replace(/\s/g, '-')}`);
    });
    return safelist;
  })(),
  theme: {
    extend: {
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
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
        em: '1em',
      },
      zIndex: {
        splash: 11,
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animate'),
  ],
};
