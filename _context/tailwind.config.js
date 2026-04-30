/**
 * Buscou Viajou — Tailwind v3 config
 * Derivado do Manual da Marca v1.
 * Valores marcados com [INFERRED] não constam no manual e foram propostos para produto digital.
 *
 * Uso:
 *   1. Salve como tailwind.config.js na raiz do projeto.
 *   2. Certifique-se de ter importado as fontes no CSS global (Hind + Poppins via Google Fonts).
 *   3. Para títulos em Gotham, adicione licença + @font-face próprio.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./pages/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bv: {
          // --- Oficiais ---
          navy:  "#0B2A43",
          green: "#2B9366",

          // --- Neutras [INFERRED] ---
          bg:   "#F1F5F6",
          grid: "#E1E7EA",

          // --- Escala navy [INFERRED, exceto 500] ---
          "navy-50":  "#E7ECF0",
          "navy-100": "#CED9E1",
          "navy-200": "#9DB3C3",
          "navy-300": "#6C8DA6",
          "navy-400": "#3B6788",
          "navy-500": "#0B2A43",
          "navy-600": "#092336",
          "navy-700": "#071B2A",
          "navy-800": "#04131D",
          "navy-900": "#020810",

          // --- Escala green [INFERRED, exceto 500] ---
          "green-50":  "#E4F4EC",
          "green-100": "#C9E9D9",
          "green-200": "#95D3B3",
          "green-300": "#60BC8C",
          "green-400": "#3FA675",
          "green-500": "#2B9366",
          "green-600": "#237652",
          "green-700": "#1A583E",
          "green-800": "#123B29",
          "green-900": "#091D14",

          // --- Semânticas [INFERRED] ---
          success: "#2B9366",
          info:    "#0B2A43",
          warning: "#E0A23B",
          danger:  "#C64343",
        },
      },

      fontFamily: {
        heading: ["Gotham", "Poppins", "Helvetica Neue", "Arial", "sans-serif"],
        body:    ["Hind", "Poppins", "Helvetica Neue", "Arial", "sans-serif"],
      },

      fontSize: {
        display:  ["3.5rem",   { lineHeight: "1.1",  letterSpacing: "-0.01em" }],
        h1:       ["2.5rem",   { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        h2:       ["2rem",     { lineHeight: "1.25" }],
        h3:       ["1.5rem",   { lineHeight: "1.25" }],
        h4:       ["1.25rem",  { lineHeight: "1.5"  }],
        "body-lg":["1.125rem", { lineHeight: "1.5"  }],
        body:     ["1rem",     { lineHeight: "1.5"  }],
        "body-sm":["0.875rem", { lineHeight: "1.5"  }],
        caption:  ["0.75rem",  { lineHeight: "1.5"  }],
      },

      fontWeight: {
        regular:  "400",
        medium:   "500",
        semibold: "600",
        bold:     "700",
        black:    "900",
      },

      spacing: {
        // Sistema 8pt [INFERRED]
        "bv-1": "0.25rem",
        "bv-2": "0.5rem",
        "bv-3": "0.75rem",
        "bv-4": "1rem",
        "bv-5": "1.5rem",
        "bv-6": "2rem",
        "bv-7": "3rem",
        "bv-8": "4rem",
        "bv-9": "6rem",
      },

      borderRadius: {
        "bv-sm":   "4px",
        "bv-md":   "8px",
        "bv-lg":   "16px",
        "bv-pill": "9999px",
      },

      boxShadow: {
        "bv-sm":    "0 1px 2px rgba(11, 42, 67, 0.06)",
        "bv-md":    "0 4px 12px rgba(11, 42, 67, 0.08)",
        "bv-lg":    "0 12px 32px rgba(11, 42, 67, 0.12)",
        "bv-focus": "0 0 0 3px rgba(43, 147, 102, 0.35)",
      },

      borderWidth: {
        "bv-thin":  "1px",
        "bv-base":  "2px",
        "bv-thick": "3px",
      },

      backgroundImage: {
        // Padrão blueprint recorrente no manual
        "bv-grid": `
          linear-gradient(to right,  #E1E7EA 1px, transparent 1px),
          linear-gradient(to bottom, #E1E7EA 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        "bv-grid": "32px 32px",
      },

      maxWidth: {
        "bv-container": "1200px",
      },

      transitionTimingFunction: {
        "bv-ease": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
      transitionDuration: {
        "bv-fast": "150ms",
        "bv-base": "250ms",
        "bv-slow": "400ms",
      },
    },
  },
  plugins: [
    // Adiciona utilitário .bv-canvas para backgrounds blueprint
    function ({ addUtilities }) {
      addUtilities({
        ".bv-canvas": {
          backgroundColor: "#F1F5F6",
          backgroundImage: `
            linear-gradient(to right,  #E1E7EA 1px, transparent 1px),
            linear-gradient(to bottom, #E1E7EA 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        },
      });
    },
  ],
};
