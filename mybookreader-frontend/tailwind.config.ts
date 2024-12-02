import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#080521", // FIRST BLUE
        },
        secondary: {
          100: "#F3F5F9",
          200: "#EAEBF1",
          300: "#71ACD4", //LIGHT BLUE FOR TEXTS
          400: "#196A81",
          DEFAULT: "#2E668B", //SOME BLUE
          600: "#1D375E",
          700: "#2E668B",
          800: "#1C365D",
          900: "#767491",
        },
        tertiary: {
          DEFAULT: "#FFB334", //ORANGE
        },
      primaryGreen: {
        50: "#E6FFF9",
        100: "#D1FFF3",
        200: "#9FFEE6",
        300: "#71FEDB",
        400: "#3EFECE",
        500: "#11FEC2",
        600: "#01DAA4",
        700: "#01AB80",
        800: "#017054",
        900: "#00382A",
        950: "#001E17"
      },
        "formi-dark-green": "#007155",
        "formideo-white": "#F3F5F9",
        "formideo-gray": "#EAEBF1",
        "formideo-gray2": "#8D91A9",
        "formideo-white-divisor": "#628AA3",
        "soft-green-100": "#CDFFEB",
        "selected-green": "#00CC99",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        sofia: ["var(--font-sofia)"],
      },
            backgroundImage: {
        gradiantRadial: "radial-gradient(var(--tw-gradient-stops))",
        "gradient-image-banner":"linear-gradient(156deg, rgba(255, 255, 255, 0.80) 0%,rgba(255, 255, 255, 0.48) 100%)",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "formideo-custom-gradient":
          "linear-gradient(96deg, #34B6C8 0%, #31C99A 100.98%)",
        "gradient-card": "linear-gradient(180deg, #196A81 0%, #0A3C5E 100%)",
        "gradient-card-how-it-works":
          "linear-gradient(160deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.06) 100%)",
        "purple-linear-gradient":
          "linear-gradient(150deg, #767491 0%, #272348 100%)",
        "formideo-white-gradient":
          "linear-gradient(156deg, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.06) 100%);",
      },
      backgroundColor: {
        "custom-bg-section-blue": "#0A3C5E",
        "custom-main-blue": "#080520", 
        "header-card-blue": "#0B456C",
      },
    },
  },
  plugins: [],
} satisfies Config;
