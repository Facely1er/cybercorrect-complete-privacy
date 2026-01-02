/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.html",
    "./legal/*.html",
    "./includes/*.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(42, 111, 127)',
          foreground: 'rgb(255, 255, 255)',
        },
        accent: {
          DEFAULT: 'rgb(0, 229, 255)',
          foreground: 'rgb(255, 255, 255)',
        },
        background: 'rgb(255, 255, 255)',
        foreground: 'rgb(17, 24, 39)',
        muted: {
          DEFAULT: 'rgb(156, 163, 175)',
          foreground: 'rgb(107, 114, 128)',
        },
        card: {
          DEFAULT: 'rgb(255, 255, 255)',
          foreground: 'rgb(17, 24, 39)',
        },
        border: 'rgb(229, 231, 235)',
        'secure-green': 'rgb(42, 111, 127)',
      }
    }
  },
  plugins: [],
}

