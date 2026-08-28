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
      <div className="flex min-h-screen w-full flex-col">
        {!hideLayout && <Header />}

        <main className="flex w-full flex-1 flex-col">{children}</main>

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
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      {children}
    </div>
  );
}
