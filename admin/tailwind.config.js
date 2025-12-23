/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        accent: '#10b981',
        sidebar: '#f8fafc',
        card: '#ffffff',
        'content-bg': '#f5f7fa', // New background color for main content areas
      },
    },
  },
  plugins: [],
}
