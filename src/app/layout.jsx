import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { LayoutWrapper } from "@/components/LayoutWrapper";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Nestora | Find a place that feels like home",
    description: "A trusted platform for discovering, listing, and booking rental properties.",
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        ],
        shortcut: "/favicon.ico",
        apple: "/icon-192.png",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
                <Providers>
                    <LayoutWrapper>
                        {children}
                    </LayoutWrapper>
                </Providers>
            </body>
        </html>
    );
}
