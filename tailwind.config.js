/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: "class", // optionnel mais recommandé
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    // Bouton retour / focus rings
    "stroke-blue-300",
    "hover:scale-125",
    "active:scale-100",
    "focus-visible:ring",
    "focus-visible:ring-2",
    "focus-visible:ring-blue-200",
    "focus-visible:ring-offset-2",

    // BrandLink
    "text-green-400",
    "hover:text-green-300",
    "bg-gradient-to-t",
    "from-green-400",
    "to-green-600",

    // Si tu utilises ces classes ailleurs dynamiquement :
    "animate-blink",
    "animate-fade",
    "bg-techno-gradient",
  ],
  theme: {
    extend: {
      fontFamily: {
        "space-grotesk": ['"Space Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
        "inter": ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "techno-gradient": "linear-gradient(90deg, #0ff 0%, #a259ff 50%, #0ff 100%)",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        blink: "blink 0.5s infinite",
        fade: "blink 3s infinite",
        gradient: "gradient 8s linear infinite",
      },
    },
  },
  plugins: [],
  // Petit plus: Tailwind n'applique :hover que si supporté (réduit CSS final)
  future: { hoverOnlyWhenSupported: true },
};
