import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        dearnote: {
          "primary": "#a78bfa",
          "primary-content": "#0f0a1e",
          "secondary": "#c084fc",
          "secondary-content": "#0f0a1e",
          "accent": "#818cf8",
          "accent-content": "#0f0a1e",
          "neutral": "#1e1b2e",
          "neutral-content": "#e2dff0",
          "base-100": "#13111c",
          "base-200": "#0f0d17",
          "base-300": "#0b0a12",
          "base-content": "#e8e4f3",
          "info": "#7dd3fc",
          "success": "#4ade80",
          "warning": "#fbbf24",
          "error": "#fb7185",
        },
      },
      {
        "dearnote-light": {
          "primary": "#8e4f1d",
          "primary-content": "#fcfaf2",
          "secondary": "#a77a3f",
          "secondary-content": "#fcfaf2",
          "accent": "#5f7054",
          "accent-content": "#fcfaf2",
          "neutral": "#efe9db",
          "neutral-content": "#3c2f1d",
          "base-100": "#fcfaf2",
          "base-200": "#f4eee1",
          "base-300": "#e7dcbf",
          "base-content": "#2e210f",
          "info": "#4a7ba5",
          "success": "#58a272",
          "warning": "#caa052",
          "error": "#d66868",
        },
      },
      "night",
      "dracula",
      "luxury",
      "sunset",
    ],
  },
};