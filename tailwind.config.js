/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{html,js,jsx,ts,tsx}',
],

  theme: {
    extend: {

      // ── Color Palette ───────────────────────────────────────────────
      colors: {
        // Neutrals — warm whites to deep charcoal
        stone: {
          50:  '#FAFAF9',
          100: '#F5F4F2',
          200: '#ECEAE6',
          300: '#D8D5CF',
          400: '#B5B0A8',
          500: '#8C8780',
          600: '#635F59',
          700: '#4A4641',
          800: '#2E2B27',
          900: '#1A1814',
        },

        // Accent — single muted sage green (architectural, calm)
        accent: {
          50:  '#F2F7F4',
          100: '#E0EDE6',
          200: '#BCDACE',
          300: '#8EC2AF',
          400: '#5DA48E',
          500: '#3D7A5A',   // ← primary accent (matches current app)
          600: '#306249',
          700: '#254D3A',
          800: '#1A372A',
          900: '#0F211A',
        },

        // Functional
        white:       '#FFFFFF',
        black:       '#0D0D0D',
        transparent: 'transparent',
      },

      // ── Typography ──────────────────────────────────────────────────
      fontFamily: {
        sans: [
          'DM Sans',
          'Inter',
          'Heebo',          // Hebrew support
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        display: [
          'DM Sans',
          'Inter',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'monospace',
        ],
      },

      fontSize: {
        '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.04em' }],
        'xs':  ['11px', { lineHeight: '16px', letterSpacing: '0.03em' }],
        'sm':  ['12px', { lineHeight: '18px', letterSpacing: '0.01em' }],
        'base':['14px', { lineHeight: '22px', letterSpacing: '0' }],
        'md':  ['15px', { lineHeight: '24px', letterSpacing: '-0.01em' }],
        'lg':  ['17px', { lineHeight: '26px', letterSpacing: '-0.01em' }],
        'xl':  ['20px', { lineHeight: '28px', letterSpacing: '-0.02em' }],
        '2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.02em' }],
        '3xl': ['30px', { lineHeight: '38px', letterSpacing: '-0.03em' }],
        '4xl': ['36px', { lineHeight: '44px', letterSpacing: '-0.03em' }],
      },

      fontWeight: {
        thin:       '300',
        normal:     '400',
        medium:     '500',
        semibold:   '600',
        bold:       '700',
      },

      letterSpacing: {
        tightest: '-0.04em',
        tighter:  '-0.02em',
        tight:    '-0.01em',
        normal:   '0',
        wide:     '0.04em',
        wider:    '0.08em',
        widest:   '0.12em',   // for all-caps labels
      },

      lineHeight: {
        none:    '1',
        tight:   '1.25',
        snug:    '1.375',
        normal:  '1.55',
        relaxed: '1.7',
      },

      // ── Spacing ─────────────────────────────────────────────────────
      spacing: {
        '0':    '0',
        '1':    '4px',
        '2':    '8px',
        '3':    '12px',
        '4':    '16px',
        '5':    '20px',
        '6':    '24px',
        '8':    '32px',
        '10':   '40px',
        '12':   '48px',
        '16':   '64px',
        '20':   '80px',
        '24':   '96px',
        '32':   '128px',
      },

      // ── Border Radius ────────────────────────────────────────────────
      borderRadius: {
        'none': '0',
        'sm':   '4px',
        'md':   '8px',
        'lg':   '12px',
        'xl':   '16px',
        '2xl':  '24px',
        'full': '9999px',
      },

      // ── Shadows ──────────────────────────────────────────────────────
      boxShadow: {
        'sm':   '0 1px 3px rgba(0,0,0,0.06)',
        'md':   '0 2px 10px rgba(0,0,0,0.08)',
        'lg':   '0 4px 24px rgba(0,0,0,0.10)',
        'xl':   '0 8px 40px rgba(0,0,0,0.12)',
        'inner':'inset 0 1px 3px rgba(0,0,0,0.06)',
        'none': 'none',
      },

      // ── Transitions ──────────────────────────────────────────────────
      transitionDuration: {
        fast:   '100ms',
        normal: '180ms',
        slow:   '320ms',
      },

      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },

  plugins: [],
};
