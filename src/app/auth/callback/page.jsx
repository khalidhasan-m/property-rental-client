"use client";
import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { LoadingState } from "@/components/LoadingState";

/**
 * OAuth callback landing page.
 *
 * Better Auth redirects here after a successful Google sign-in.
 * We read the active session, ensure the user has a role (defaulting to
 * "tenant"), persist them in AuthContext, then forward to the intended page.
 */
export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUser } = useAuth();
    const ran = useRef(false);

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;

        const redirect = (() => {
            const r = searchParams.get("redirect");
            return r && r.startsWith("/") && !r.startsWith("//") ? r : "/dashboard";
        })();

        async function finalise() {
            try {
                // 1. Read the Better Auth session (cookie is already set by the
                //    OAuth callback handled on the server at /api/auth/callback/google)
                const session = await authClient.getSession();
                const baUser = session?.data?.user;

                if (baUser) {
                    // 2. Ensure the user exists in our own users collection and
                    //    has a role assigned. Better Auth creates users in its own
                    //    `user` table; our middleware looks up the same email in
                    //    the `users` collection. If this is a brand-new Google
                    //    user, call /auth/social-sync to upsert with role=tenant.
                    try {
                        const { data } = await api.post("/auth/social-sync", {
                            email: baUser.email,
                            name: baUser.name,
                            photoURL: baUser.image || baUser.photoURL || undefined,
                        });
                        if (data?.data) {
                            setUser(data.data);
                            router.replace(redirect);
                            return;
                        }
                    } catch {
                        // If social-sync doesn't exist, fall back to /auth/me
                    }

                    // Fallback: try /auth/me which reads the Better Auth session
                    try {
                        const { data } = await api.get("/auth/me");
                        if (data?.data) {
                            setUser(data.data);
                            router.replace(redirect);
                            return;
                        }
                    } catch {
                        // pass
                    }

                    // Last resort: use the Better Auth user directly
                    setUser({
                        ...baUser,
                        _id: baUser.id,
                        role: baUser.role || "tenant",
                        photoURL: baUser.image || baUser.photoURL,
                    });
                }
            } catch {
                // Session read failed — still redirect so the user isn't stuck
            }

            router.replace(redirect);
        }

        void finalise();
    }, [searchParams, setUser, router]);

    return <LoadingState label="Signing you in…" />;
}
