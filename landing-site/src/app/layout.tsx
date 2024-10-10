import { Metadata } from "next";
export const metadata: Metadata = {
    title: {
        default: "Algorhythm",
        template: "%s | Algorhythm",
    },
    description: "Get your artists to break through the noise.",
};

import localFont from "next/font/local";

const neue = localFont({
    src: [
        {
            path: "../../public/assets/fonts/neue-einstellung/NeueEinstellung-Regular.ttf",
            weight: "400",
        },
        {
            path: "../../public/assets/fonts/neue-einstellung/NeueEinstellung-Bold.ttf",
            weight: "700",
        },
    ],
    variable: "--font-neue",
});

const ttInterphasesPro = localFont({
    src: [
        {
            path: "../../public/assets/fonts/tt-interphases-pro/TT Interphases Pro Trial Regular.ttf",
            weight: "400",
        },
        {
            path: "../../public/assets/fonts/tt-interphases-pro/TT Interphases Pro Trial Medium.ttf",
            weight: "500",
        },
        {
            path: "../../public/assets/fonts/tt-interphases-pro/TT Interphases Pro Trial Bold.ttf",
            weight: "700",
        },
    ],
    variable: "--font-interphases-pro",
});

import "./globals.css";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${neue.variable} ${ttInterphasesPro.variable}`}
        >
            <body className="bg-black text-white font-inter flex flex-col justify-start">
                {children}
            </body>
        </html>
    );
}
