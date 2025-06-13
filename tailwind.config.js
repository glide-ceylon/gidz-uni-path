/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Brand Colors        primary: {
        50: "#EFF6FF",
        100: "#DBEAFE",
        200: "#BFDBFE",
        300: "#93C5FD",
        400: "#60A5FA",
        500: "#3B82F6",
        600: "#2563EB",
        700: "#1D4ED8",
        800: "#1E40AF",
        900: "#1E3A8A",
      },
      // Neutral Palette
      midnight: "#0A0E1A",
      slate: {
        50: "#F8FAFC",
        100: "#F1F5F9",
        200: "#E2E8F0",
        600: "#64748B",
        800: "#1E293B",
      },
      // Semantic Colors
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    },
    fontFamily: {
      "sf-pro": ["SF Pro Display", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      "sf-text": ["SF Pro Text", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
    },
    fontSize: {
      hero: ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1.2", fontWeight: "700" }],
      "headline-lg": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.2", fontWeight: "600" }],
      "headline-md": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.3", fontWeight: "600" }],
      "headline-sm": ["clamp(1.25rem, 2.5vw, 1.875rem)", { lineHeight: "1.4", fontWeight: "600" }],
      "body-lg": ["1.125rem", { lineHeight: "1.7", fontWeight: "400" }],
      body: ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
    },
    spacing: {
      18: "4.5rem",
      88: "22rem",
      128: "32rem",
    },
    boxShadow: {
      premium: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      "premium-lg": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      "premium-xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    },
    animation: {
      "gradient-move": "gradientMove 3s infinite alternate",
      float: "float 6s ease-in-out infinite",
      "fade-in": "fadeIn 0.5s ease-out",
      "slide-up": "slideUp 0.5s ease-out",
    },
    keyframes: {
      gradientMove: {
        "0%": { backgroundPosition: "0% 50%" },
        "100%": { backgroundPosition: "100% 50%" },
      },
      float: {
        "0%, 100%": { transform: "translateY(0px)" },
        "50%": { transform: "translateY(-20px)" },
      },
      fadeIn: {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
      slideUp: {
        "0%": { opacity: "0", transform: "translateY(30px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
    },
    backgroundSize: {
      "400%": "400%",
    },
    transitionTimingFunction: {
      premium: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
};
