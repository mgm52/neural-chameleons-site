/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Noto Serif', 'Georgia', 'Times New Roman', 'serif'],
        'sans': ['Noto Sans', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['Fira Mono', 'Courier New', 'monospace'],
      },
      colors: {
        'neural-blue': '#6366f1',
        'neural-purple': '#8b5cf6',
        'neural-pink': '#ec4899',
        // 'neural-green': 'rgb(97, 136, 53)',
        'neural-green': '#10b981',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

