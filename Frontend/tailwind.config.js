/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-bg-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
        accent: 'rgb(var(--color-bg-accent) / <alpha-value>)',
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'text-accent': 'rgb(var(--color-text-accent) / <alpha-value>)',
        'border-primary': 'rgb(var(--color-border-primary) / <alpha-value>)',
        'border-secondary': 'rgb(var(--color-border-secondary) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
