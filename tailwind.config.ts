import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Holiday Resort Brand Colors (ref: PAGE-PROTOTYPES.md)
        primary: {
          DEFAULT: "#1A5F7A", // Holiday Resort Blue
          50: "#E8F4F8",
          100: "#C5E3EC",
          200: "#9FD0DE",
          300: "#78BDCF",
          400: "#5AADBF",
          500: "#3D9DAF",
          600: "#2C8096",
          700: "#1A5F7A",
          800: "#12465C",
          900: "#0B2D3D",
        },
        accent: {
          DEFAULT: "#D4A853", // Warm Gold
          50: "#FBF6EC",
          100: "#F5E6CC",
          200: "#ECD19E",
          300: "#E3BC71",
          400: "#DCA94E",
          500: "#D4A853",
          600: "#B8913D",
          700: "#96732E",
          800: "#745720",
          900: "#523C14",
        },
        surface: {
          DEFAULT: "#FAF8F5", // Warm off-white
          dark: "#F0EDE8",
          darker: "#E5E0D9",
        },
        success: "#2D8B4E",
        warning: "#D4893A",
        destructive: "#C13A3A",
        info: "#3B7ABF",

        // shadcn/ui CSS variable mappings (for compatibility)
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "-apple-system", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        hero: ["clamp(2rem, 1.5rem + 2.5vw, 3.5rem)", { lineHeight: "1.15" }],
        "section-title": [
          "clamp(1.25rem, 1rem + 1.25vw, 2rem)",
          { lineHeight: "1.25" },
        ],
        body: ["1rem", { lineHeight: "1.6" }],
        caption: ["0.875rem", { lineHeight: "1.5" }],
      },
      spacing: {
        section: "clamp(2rem, 1.5rem + 2.5vw, 4rem)",
        "content-gap": "clamp(1rem, 0.75rem + 1.25vw, 2rem)",
      },
      borderRadius: {
        smooth: "0.75rem",
        card: "1rem",
        button: "0.5rem",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 4px 20px rgba(0, 0, 0, 0.12)",
        modal: "0 8px 40px rgba(0, 0, 0, 0.2)",
      },
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1440px",
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "scale-in": "scaleIn 200ms ease-out",
        "slide-up": "slideUp 300ms ease-out",
        "ring-breathe": "ring-breathe 2s ease-in-out infinite",
        // Dialog-specific animations — CSS-driven so they work reliably on
        // mobile where JS-based rAF/transition approaches can miss frames.
        "dialog-backdrop-in": "dialogBackdropIn 300ms ease-out",
        "dialog-slide-up": "dialogSlideUp 300ms ease-out",
        "dialog-scale-in": "dialogScaleIn 300ms ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ring-breathe": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
        },
        dialogBackdropIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        dialogSlideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        dialogScaleIn: {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
