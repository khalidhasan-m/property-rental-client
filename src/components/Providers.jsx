"use client";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";

export function Providers({ children }) {
    return (
        <HeroUIProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                <AuthProvider>
                    {children}
                    <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
                </AuthProvider>
            </ThemeProvider>
        </HeroUIProvider>
    );
}
