import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F05C3E",
        secondary: "#000000",
        "accent-gold": "#F05C3E",
        "navy-deep": "#000000",
        "navy-900": "#000000",
        "navy-800": "#1a1a1a",
        charcoal: "#1a1a1a",
        "soft-grey": "#f8f9fa",
        "border-light": "#e5e7eb",
        "background-main": "#f8fafc",
        "sidebar-bg": "#ffffff",
        "background-light": "#ffffff",
        "surface-light": "#f8fafc",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
      boxShadow: {
        subtle:
          "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 10px -2px rgba(0, 0, 0, 0.03)",
        hover:
          "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
