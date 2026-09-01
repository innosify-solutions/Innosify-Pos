import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
          muted: 'var(--color-surface-muted)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        content: {
          DEFAULT: 'var(--color-content)',
          muted: 'var(--color-content-muted)',
          inverse: 'var(--color-content-inverse)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          muted: 'var(--color-accent-muted)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          muted: 'var(--color-success-muted)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          muted: 'var(--color-warning-muted)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          muted: 'var(--color-danger-muted)',
        },
        /* shadcn/ui semantic aliases — same tokens, so generated components match the POS theme */
        background: 'var(--color-surface)',
        foreground: 'var(--color-content)',
        primary: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-content-inverse)',
        },
        secondary: {
          DEFAULT: 'var(--color-surface-muted)',
          foreground: 'var(--color-content)',
        },
        muted: {
          DEFAULT: 'var(--color-surface-muted)',
          foreground: 'var(--color-content-muted)',
        },
        destructive: {
          DEFAULT: 'var(--color-danger)',
          foreground: 'var(--color-content-inverse)',
        },
        card: {
          DEFAULT: 'var(--color-surface)',
          foreground: 'var(--color-content)',
        },
        popover: {
          DEFAULT: 'var(--color-surface)',
          foreground: 'var(--color-content)',
        },
        ring: 'var(--color-accent)',
        input: 'var(--color-border)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      spacing: {
        shell: 'var(--spacing-shell)',
        sidebar: 'var(--spacing-sidebar)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius-default)',
        lg: 'var(--radius-lg)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
