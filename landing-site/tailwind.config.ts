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
                neue: ["var(--font-neue)"],
                inter: ["var(--font-interphases-pro)"],
            },
            colors: {
                // black: "#191819",
                black: "#000000",
                purple: "#171586",
                lightGold: "#bf9b30",
                darkGold: "#a67c00",
            },
        },
    },
    plugins: [],
};
export default config;
