/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#131313",
        surface: "#2d2d2d",
        "surface-hover": "#3a3a3a",
        mint: "#3cffd0",
        "mint-dark": "#309875",
        ultraviolet: "#5200ff",
        "ultraviolet-dark": "#3d00bf",
        "link-blue": "#3860be",
        "focus-cyan": "#1eaedb",
        "text-primary": "#ffffff",
        "text-secondary": "#949494",
        "text-muted": "#e9e9e9",
        "text-inverted": "#131313",
        "image-frame": "#313131",
        "overlay-black": "rgba(0,0,0,0.33)",
        "dim-gray": "#8c8c8c",
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        pill: "20px",
        "pill-lg": "30px",
        "pill-xl": "40px",
      },
    },
  },
  plugins: [],
}

