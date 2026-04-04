import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs:  "390px",  // small phones — Galaxy S, iPhone SE
      sm:  "640px",
      md:  "768px",
      lg:  "1024px",
      xl:  "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // ── Foreground / text ─────────────────────────────────────────────────
        foreground: "#F0D080",        // gold-light — primary text on dark backgrounds
        "foreground-muted": "#8899AA",// muted / secondary text

        // ── VisionTech Navy / Dark backgrounds ────────────────────────────────
        obsidian: {
          deep:    "#020B19",  // deepest background
          DEFAULT: "#04122B",  // main background
          card:    "#071A38",  // card surfaces
          light:   "#0A2450",  // borders, dividers, hover
          muted:   "#1A3A6A",  // muted borders
          steel:   "#3A5A7A",  // muted text / inactive icons
        },

        // ── VisionTech Gold accents ────────────────────────────────────────────
        gold: {
          dark:    "#7A5F1A",
          deep:    "#A87830",
          DEFAULT: "#C8A550",  // primary accent — CTAs, prices
          mid:     "#DEB860",
          light:   "#F0D080",  // heading text, highlighted labels
          pale:    "#FBF0CC",
        },

        // ── Order / stock status ───────────────────────────────────────────────
        status: {
          paid:       "#4FC87A",  // success — green
          pending:    "#F0D080",  // warning — gold/yellow
          cancelled:  "#E05A5A",  // error — red
          dispatched: "#6BB5F5",  // info — blue
        },
      },

      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body:    ["DM Sans", "system-ui", "sans-serif"],
      },

      borderRadius: {
        DEFAULT: "0.5rem",
        sm:  "0.25rem",
        md:  "0.375rem",
        lg:  "0.5rem",
        xl:  "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },

      borderColor: {
        DEFAULT: "#0A2450",  // obsidian-light — so bare `border` class works
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-in":        "fade-in 0.35s ease-out",
        "slide-up":       "slide-up 0.4s ease-out",
        shimmer:          "shimmer 1.5s infinite",
        spin:             "spin 1s linear infinite",
        pulse:            "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
      },

      boxShadow: {
        gold:    "0 4px 20px rgba(200, 165, 80, 0.25)",
        "gold-sm": "0 2px 10px rgba(200, 165, 80, 0.15)",
        card:    "0 2px 16px rgba(2, 11, 25, 0.6)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;