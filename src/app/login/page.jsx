"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, LockKeyhole } from "lucide-react";
import toast from "react-hot-toast";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { authClient } from "@/lib/auth-client";

const schema = z.object({ email: z.string().email("Enter a valid email"), password: z.string().min(6, "Password must be at least 6 characters") });
const getSafeRedirect = () => { if (typeof window === "undefined") return "/dashboard"; const value = new URLSearchParams(window.location.search).get("redirect"); return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard"; };

export default function LoginPage() {
    const router = useRouter();
    const { setUser, user, loading } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

    useEffect(() => {
        if (!loading && user) {
            router.replace(getSafeRedirect());
        }
    }, [user, loading, router]);

    const onSubmit = async (values) => {
        try {
            const { data } = await api.post("/auth/login", values);
            setUser(data.data);
            toast.success("Welcome back");
            router.push(getSafeRedirect());
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const redirect = getSafeRedirect();
            const callbackURL = `${window.location.origin}/auth/callback${redirect !== "/dashboard" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`;
            await authClient.signIn.social({
                provider: "google",
                callbackURL,
            });
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Google sign in failed"));
        }
    };

    return (
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 grid min-h-[calc(100vh-10rem)] place-items-center py-12">
            <section className="w-full max-w-md rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-7 shadow-xl shadow-emerald-950/5 sm:p-9">
                <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Welcome back</span>
                <h1 className="mt-3 text-4xl font-black tracking-[-.05em]">Sign in to Nestora</h1>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Your properties, booking requests, and saved spaces are waiting for you.</p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="mt-7 grid gap-5">
                    <div className="grid gap-1.5">
                        <Input
                            label="Email"
                            labelPlacement="outside"
                            placeholder="you@example.com"
                            type="email"
                            startContent={<Mail size={17} className="text-[var(--muted)]" />}
                            {...register("email")}
                        />
                        {errors.email && <p className="text-xs font-medium text-rose-600">{errors.email.message}</p>}
                    </div>
                    <div className="grid gap-1.5">
                        <Input
                            label="Password"
                            labelPlacement="outside"
                            placeholder="••••••••"
                            type="password"
                            startContent={<LockKeyhole size={17} className="text-[var(--muted)]" />}
                            {...register("password")}
                        />
                        {errors.password && <p className="text-xs font-medium text-rose-600">{errors.password.message}</p>}
                    </div>
                    <Button type="submit" isLoading={isSubmitting} className="mt-2 h-12 bg-[var(--brand)] font-black text-white rounded-xl">Sign in</Button>
                </form>

                <div className="my-6 flex items-center gap-3 text-xs font-bold text-[var(--muted)]">
                    <span className="h-px flex-1 bg-[var(--line)]"/>OR<span className="h-px flex-1 bg-[var(--line)]"/>
                </div>

                <Button onClick={handleGoogleSignIn} variant="bordered" className="w-full h-12 font-bold border-[var(--line)] rounded-xl">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    Sign in with Google
                </Button>

                <p className="mt-6 text-center text-sm text-[var(--muted)]">New here? <Link className="font-black text-[var(--brand)]" href="/register">Create an account</Link></p>
            </section>
        </div>
    );
}
