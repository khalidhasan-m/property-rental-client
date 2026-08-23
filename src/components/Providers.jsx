"use client";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
export function Providers({ children }) {
    const content = <HeroUIProvider><ThemeProvider attribute="class" defaultTheme="light" enableSystem><AuthProvider>{children}<Toaster position="top-right" toastOptions={{ duration: 3500 }}/></AuthProvider></ThemeProvider></HeroUIProvider>;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    return clientId ? <GoogleOAuthProvider clientId={clientId}>{content}</GoogleOAuthProvider> : content;
}
