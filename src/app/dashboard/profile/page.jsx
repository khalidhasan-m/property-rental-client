"use client";
import { Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api, getApiErrorMessage } from "@/lib/api";
const profileSchema = z.object({ name: z.string().min(2), phone: z.string().min(6).optional().or(z.literal("")), photoURL: z.string().url().optional().or(z.literal("")) });
export default function ProfilePage() {
    const { user, setUser } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(profileSchema), values: { name: user?.name || "", phone: user?.phone || "", photoURL: user?.photoURL || "" } });
    const onSubmit = async (values) => { try {
        const { data } = await api.patch("/auth/profile", values);
        setUser(data.data);
        toast.success("Profile updated");
    }
    catch (error) {
        toast.error(getApiErrorMessage(error));
    } };
    return <div><span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Account settings</span><h1 className="mt-2 text-3xl font-black tracking-[-.04em]">Your profile</h1><p className="mt-2 text-sm text-[var(--muted)]">Keep your details current so rental communication stays straightforward.</p><form onSubmit={handleSubmit(onSubmit)} className="mt-7 max-w-xl rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6"><div className="grid gap-4"><div><Input label="Full name" {...register("name")}/>{errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}</div><Input label="Contact number" {...register("phone")}/><div><Input label="Photo URL" {...register("photoURL")}/>{errors.photoURL && <p className="mt-1 text-xs text-rose-600">{errors.photoURL.message}</p>}</div><div className="rounded-2xl bg-emerald-50 p-4 text-sm dark:bg-emerald-950"><p className="font-black">Role: <span className="capitalize">{user?.role}</span></p><p className="mt-1 text-[var(--muted)]">Roles are managed by administrators to keep marketplace access secure.</p></div><Button type="submit" isLoading={isSubmitting} className="w-fit bg-[var(--brand)] font-bold text-white">Save changes</Button></div></form></div>;
}
