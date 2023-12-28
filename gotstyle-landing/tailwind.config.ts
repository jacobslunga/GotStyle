import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        logo: "Logo",
        "bas-bold": "Bas Bold",
        "bas-reg": "Bas Regular",
        "bas-med": "Bas Med",
        "bas-semi": "Bas Semi",
      },
      colors: {
        "pink-grad": "#FFA1F5",
        "red-grad": "#FF00AA",
        "yellow-grad": "#FAFF00",
        "red2-grad": "#FF004C",
      },
    },
  },
  plugins: [require("daisyui")],
};
export default config;
