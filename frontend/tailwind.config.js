/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        hogwarts: {
          "primary": "#740001",
          "primary-content": "#D3A625",
          "secondary": "#D3A625",
          "secondary-content": "#1a0000",
          "accent": "#aaaaaa",
          "neutral": "#1a1a2e",
          "base-100": "#0d0d0d",
          "base-200": "#141414",
          "base-300": "#1e1e1e",
          "base-content": "#e8e0d0",
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      }
    ]
  }
}