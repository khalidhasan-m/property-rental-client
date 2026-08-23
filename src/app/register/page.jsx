"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Radio, RadioGroup } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, LockKeyhole, Mail, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
const schema = z.object({ name: z.string().min(2, "Enter your full name"), email: z.string().email("Enter a valid email"), photoURL: z.string().url("Enter a valid image URL").optional().or(z.literal("")), password: z.string().min(6, "Password must be at least 6 characters"), role: z.enum(["tenant", "owner"]) });
export default function RegisterPage() {
    const router = useRouter();
    const { setUser } = useAuth();
    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: { role: "tenant", photoURL: "" } });
    const onSubmit = async (values) => { try {
        const { data } = await api.post("/auth/register", values);
        setUser(data.data);
        toast.success("Your account is ready");
        router.push("/dashboard");
    }
    catch (error) {
        toast.error(getApiErrorMessage(error));
    } };
    return <div className="container-shell grid min-h-[calc(100vh-10rem)] place-items-center py-12"><section className="w-full max-w-xl rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-7 shadow-xl shadow-emerald-950/5 sm:p-9"><span className="section-kicker">Find your place</span><h1 className="mt-3 text-4xl font-black tracking-[-.05em]">Create your account</h1><p className="mt-3 text-sm leading-6 text-[var(--muted)]">Join as a tenant to book homes, or as an owner to list and manage rental properties.</p><form onSubmit={handleSubmit(onSubmit)} className="mt-7 grid gap-4 sm:grid-cols-2"><div><Input label="Full name" startContent={<UserRound size={17}/>} {...register("name")}/>{errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}</div><div><Input label="Email" type="email" startContent={<Mail size={17}/>} {...register("email")}/>{errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}</div><div className="sm:col-span-2"><Input label="Photo URL (optional)" placeholder="https://..." startContent={<ImagePlus size={17}/>} {...register("photoURL")}/>{errors.photoURL && <p className="mt-1 text-xs text-rose-600">{errors.photoURL.message}</p>}</div><div className="sm:col-span-2"><Input label="Password" type="password" startContent={<LockKeyhole size={17}/>} {...register("password")}/>{errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>}</div><div className="sm:col-span-2"><RadioGroup label="I want to join as" value={watch("role")} onValueChange={(value) => setValue("role", value)} orientation="horizontal"><Radio value="tenant">Tenant</Radio><Radio value="owner">Property owner</Radio></RadioGroup></div><Button type="submit" isLoading={isSubmitting} className="mt-2 h-12 bg-[var(--brand)] font-black text-white sm:col-span-2">Create account</Button></form><p className="mt-6 text-center text-sm text-[var(--muted)]">Already have an account? <Link className="font-black text-[var(--brand)]" href="/login">Sign in</Link></p></section></div>;
}
