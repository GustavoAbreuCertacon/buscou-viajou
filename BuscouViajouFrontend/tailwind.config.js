/**
 * Buscou Viajou — Tailwind v3 config
 * Adaptado pra Next.js 15 com fontes Gotham locais.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bv: {
          navy:  '#0B2A43',
          green: '#2B9366',
          bg:    '#F1F5F6',
          grid:  '#E1E7EA',

          'navy-50':  '#E7ECF0',
          'navy-100': '#CED9E1',
          'navy-200': '#9DB3C3',
          'navy-300': '#6C8DA6',
          'navy-400': '#3B6788',
          'navy-500': '#0B2A43',
          'navy-600': '#092336',
          'navy-700': '#071B2A',
          'navy-800': '#04131D',
          'navy-900': '#020810',

          'green-50':  '#E4F4EC',
          'green-100': '#C9E9D9',
          'green-200': '#95D3B3',
          'green-300': '#60BC8C',
          'green-400': '#3FA675',
          'green-500': '#2B9366',
          'green-600': '#237652',
          'green-700': '#1A583E',
          'green-800': '#123B29',
          'green-900': '#091D14',

          success: '#2B9366',
          info:    '#0B2A43',
          warning: '#E0A23B',
          danger:  '#C64343',
        },
      },

      fontFamily: {
        heading: ['Gotham', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body:    ['Hind', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },

      fontSize: {
        display:   ['3.5rem',   { lineHeight: '1.1',  letterSpacing: '-0.01em' }],
        h1:        ['2.5rem',   { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        h2:        ['2rem',     { lineHeight: '1.25' }],
        h3:        ['1.5rem',   { lineHeight: '1.25' }],
        h4:        ['1.25rem',  { lineHeight: '1.5'  }],
        'body-lg': ['1.125rem', { lineHeight: '1.5'  }],
        body:      ['1rem',     { lineHeight: '1.5'  }],
        'body-sm': ['0.875rem', { lineHeight: '1.5'  }],
        caption:   ['0.75rem',  { lineHeight: '1.5'  }],
      },

      fontWeight: {
        regular:  '400',
        medium:   '500',
        semibold: '600',
        bold:     '700',
        black:    '800',
        ultra:    '900',
      },

      spacing: {
        'bv-1': '0.25rem',
        'bv-2': '0.5rem',
        'bv-3': '0.75rem',
        'bv-4': '1rem',
        'bv-5': '1.5rem',
        'bv-6': '2rem',
        'bv-7': '3rem',
        'bv-8': '4rem',
        'bv-9': '6rem',
      },

      borderRadius: {
        'bv-sm':   '4px',
        'bv-md':   '8px',
        'bv-lg':   '16px',
        'bv-pill': '9999px',
      },

      boxShadow: {
        'bv-sm':    '0 1px 2px rgba(11, 42, 67, 0.06)',
        'bv-md':    '0 4px 12px rgba(11, 42, 67, 0.08)',
        'bv-lg':    '0 12px 32px rgba(11, 42, 67, 0.12)',
        'bv-focus': '0 0 0 3px rgba(43, 147, 102, 0.35)',
      },

      borderWidth: {
        'bv-thin':  '1px',
        'bv-base':  '2px',
        'bv-thick': '3px',
      },

      backgroundImage: {
        'bv-grid': `
          linear-gradient(to right,  #E1E7EA 1px, transparent 1px),
          linear-gradient(to bottom, #E1E7EA 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'bv-grid': '32px 32px',
      },

      maxWidth: {
        'bv-container': '1200px',
      },

      transitionTimingFunction: {
        'bv-ease': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      transitionDuration: {
        'bv-fast': '150ms',
        'bv-base': '250ms',
        'bv-slow': '400ms',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addUtilities }) {
      addUtilities({
        '.bv-canvas': {
          backgroundColor: '#F1F5F6',
          backgroundImage: `
            linear-gradient(to right,  #E1E7EA 1px, transparent 1px),
            linear-gradient(to bottom, #E1E7EA 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        },
        '.bv-frame-corner': {
          position: 'relative',
        },
        '.bv-frame-corner::before': {
          content: '""',
          position: 'absolute',
          width: '56px',
          height: '56px',
          top: '0',
          left: '0',
          borderTop: '2px solid #0B2A43',
          borderLeft: '2px solid #0B2A43',
        },
        '.bv-frame-corner::after': {
          content: '""',
          position: 'absolute',
          width: '56px',
          height: '56px',
          bottom: '0',
          right: '0',
          borderBottom: '2px solid #0B2A43',
          borderRight: '2px solid #0B2A43',
        },
      });
    },
  ],
};
