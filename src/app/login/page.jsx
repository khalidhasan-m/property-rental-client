"use client";
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
import { GoogleLogin } from "@react-oauth/google";
const schema = z.object({ email: z.string().email("Enter a valid email"), password: z.string().min(6, "Password must be at least 6 characters") });
export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
    const onSubmit = async (values) => { try {
        const { data } = await api.post("/auth/login", values);
        setUser(data.data);
        toast.success("Welcome back");
        router.push("/dashboard");
    }
    catch (error) {
        toast.error(getApiErrorMessage(error));
    } };
    const onGoogleSuccess = async (credential) => { if (!credential)
        return toast.error("Google did not return a sign-in credential"); try {
        const { data } = await api.post("/auth/social-login", { idToken: credential });
        setUser(data.data);
        toast.success("Signed in with Google as a tenant");
        router.push("/dashboard");
    }
    catch (error) {
        toast.error(getApiErrorMessage(error));
    } };
    return <div className="container-shell grid min-h-[calc(100vh-10rem)] place-items-center py-12"><section className="w-full max-w-md rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-7 shadow-xl shadow-emerald-950/5 sm:p-9"><span className="section-kicker">Welcome back</span><h1 className="mt-3 text-4xl font-black tracking-[-.05em]">Sign in to Nestora</h1><p className="mt-3 text-sm leading-6 text-[var(--muted)]">Your properties, booking requests, and saved spaces are waiting for you.</p><form onSubmit={handleSubmit(onSubmit)} className="mt-7 grid gap-4"><div><Input label="Email" type="email" startContent={<Mail size={17}/>} {...register("email")}/>{errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}</div><div><Input label="Password" type="password" startContent={<LockKeyhole size={17}/>} {...register("password")}/>{errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>}</div><Button type="submit" isLoading={isSubmitting} className="mt-2 h-12 bg-[var(--brand)] font-black text-white">Sign in</Button></form><div className="my-6 flex items-center gap-3 text-xs font-bold text-[var(--muted)]"><span className="h-px flex-1 bg-[var(--line)]"/>OR<span className="h-px flex-1 bg-[var(--line)]"/></div>{process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? <div className="flex justify-center"><GoogleLogin onSuccess={(response) => onGoogleSuccess(response.credential)} onError={() => toast.error("Google sign-in was cancelled or unavailable")}/></div> : <p className="rounded-xl bg-amber-50 px-3 py-2 text-center text-xs font-semibold text-amber-900 dark:bg-amber-950 dark:text-amber-100">Add a Google OAuth client ID to enable Google sign-in.</p>}<p className="mt-6 text-center text-sm text-[var(--muted)]">New here? <Link className="font-black text-[var(--brand)]" href="/register">Create an account</Link></p></section></div>;
}
