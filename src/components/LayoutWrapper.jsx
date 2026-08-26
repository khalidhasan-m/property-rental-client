"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const LayoutContext = createContext({
    hideLayout: false,
    setHideLayout: () => {},
});

export function LayoutWrapper({ children }) {
    const [hideLayout, setHideLayout] = useState(false);

    return (
        <LayoutContext.Provider value={{ hideLayout, setHideLayout }}>
            <div className="flex min-h-screen flex-col">
                {!hideLayout && <Header />}
                <main className="flex-1 flex flex-col">
                    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
                {!hideLayout && <Footer />}
            </div>
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    return useContext(LayoutContext);
}

export function StandalonePage({ children }) {
    const { setHideLayout } = useLayout();

    useEffect(() => {
        setHideLayout(true);
        return () => setHideLayout(false);
    }, [setHideLayout]);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
            {children}
        </div>
    );
}
