/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Noto Sans", "Helvetica Neue", "Arial", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"]
    },
    container: {
      center: true,
      padding: "1.5rem",
    },
    extend: {
      backgroundImage: {
        'gradient-primary': 'linear-gradient(90deg, rgb(42, 111, 127) 0%, rgb(58, 156, 168) 100%)',
        'gradient-accent': 'linear-gradient(90deg, rgb(42, 111, 127) 0%, rgb(0, 229, 255) 100%)',
        'gradient-dark': 'linear-gradient(90deg, rgb(58, 156, 168) 0%, rgb(0, 229, 255) 100%)'
      },
      colors: {
        // CyberCorrect Official Color Palette
        'cc-primary': 'rgb(var(--cc-primary))',
        'cc-accent': 'rgb(var(--cc-accent))',
        'cc-accent-dark': 'rgb(var(--cc-accent-dark))',
        'cc-bg': 'rgb(var(--cc-bg))',
        'cc-bg-secondary': 'rgb(var(--cc-bg-secondary))',
        'cc-text': 'rgb(var(--cc-text))',
        'cc-text-secondary': 'rgb(var(--cc-text-secondary))',
        'cc-card': 'rgb(var(--cc-card))',
        'cc-card-hover': 'rgb(var(--cc-card-hover))',
        'cc-border': 'rgb(var(--cc-border))',
        'cc-success': 'rgb(var(--cc-success))',
        'cc-warning': 'rgb(var(--cc-warning))',
        'cc-error': 'rgb(var(--cc-error))',
        // Legacy color names for backward compatibility - Teal Based
        'primary-teal': 'rgb(42, 111, 127)',    /* #2A6F7F - CyberCorrect Primary Teal */
        'secondary-teal': 'rgb(58, 156, 168)',  /* #3A9CA8 - CyberCorrect Secondary Teal */
        'accent-cyan': 'rgb(0, 229, 255)',      /* #00E5FF - CyberCorrect Accent Cyan */
        'surface': '#FFFFFF',
        'support-gray': '#E0E5E9',
        'alert-coral': 'rgb(0, 229, 255)',      /* Using accent cyan color */
        'success-green': 'rgb(76, 175, 80)',
        'premium-gold': '#FFD166',
        // Dark mode colors
        'dark-primary': 'rgb(17, 24, 39)',
        'dark-bg': 'rgb(15, 23, 42)',
        'dark-surface': 'rgb(30, 41, 59)',
        'dark-text': 'rgb(226, 232, 240)',
        'dark-support': '#374151',
        'dark-alert': 'rgb(0, 229, 255)',
        'dark-success': 'rgb(76, 175, 80)',
        'dark-premium': '#F59E0B',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'enhanced': "0 10px 25px -5px rgba(42, 111, 127, 0.2), 0 8px 10px -6px rgba(42, 111, 127, 0.1)",
        'glow': "0 0 20px rgba(0, 229, 255, 0.6)",
      },
    },
  },
  plugins: [],
};