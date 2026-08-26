"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUserState] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const setUser = useCallback((userData) => {

        setUserState(userData);
    }, []);

    const refreshUser = useCallback(async () => {
        // Always prefer our own /auth/me — it has photoURL from MongoDB
        try {
            const { data } = await api.get("/auth/me");
            if (data?.data) {
                setUser(data.data);
                setIsLoading(false);
                return;
            }
        } catch {
            // Fallback to Better Auth session
        }

        // Fallback: read Better Auth session (e.g. right after OAuth before our cookie is set)
        try {
            const session = await authClient.getSession();
            if (session?.data?.user) {
                const u = session.data.user;
                setUser({
                    ...u,
                    _id: u.id || u._id,
                    photoURL: u.photoURL || u.image || undefined,
                    role: u.role || "tenant",
                });
                setIsLoading(false);
                return;
            }
        } catch {
            // ignore
        }

        setUser(null);
        if (typeof window !== "undefined") {

        }
        setIsLoading(false);
    }, [setUser]);

    useEffect(() => {
        void refreshUser();
    }, [refreshUser]);

    const logout = async () => {
        try {
            await authClient.signOut();
        } catch {
            // ignore fallback
        }
        try {
            await api.post("/auth/logout");
        } finally {
            if (typeof window !== "undefined") {

            }
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, refreshUser, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within AuthProvider");
    return context;
}
