"use client";
import { useEffect } from "react";
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

const schema = z.object({
    firstName: z.string().trim().min(1, "Enter your first name"),
    lastName: z.string().trim().optional().or(z.literal("")),
    email: z.string().email("Enter a valid email"),
    photoURL: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["tenant", "owner"])
});

export default function RegisterPage() {
    const router = useRouter();
    const { setUser, user, loading } = useAuth();
    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { role: "tenant", photoURL: "" }
    });

    useEffect(() => {
        if (!loading && user) {
            router.replace("/dashboard");
        }
    }, [user, loading, router]);

    const onSubmit = async (values) => {
        try {
            const { firstName, lastName, ...rest } = values;
            const { data } = await api.post("/auth/register", {
                ...rest,
                name: [firstName, lastName].filter(Boolean).join(" "),
            });
            setUser(data.data);
            toast.success("Your account is ready");
            router.push("/dashboard");
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    };

    return (
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 grid min-h-[calc(100vh-10rem)] place-items-center py-12">
            <section className="w-full max-w-xl rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-7 shadow-xl shadow-emerald-950/5 sm:p-9">
                <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Find your place</span>
                <h1 className="mt-3 text-4xl font-black tracking-[-.05em]">Create your account</h1>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Join as a tenant to book homes, or as an owner to list and manage rental properties.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-7 grid gap-5 sm:grid-cols-2">
                    {/* First Name */}
                    <div className="grid gap-1.5">
                        <Input
                            label="First name"
                            labelPlacement="outside"
                            placeholder="Jane"
                            startContent={<UserRound size={17} className="text-[var(--muted)]" />}
                            {...register("firstName")}
                        />
                        {errors.firstName && <p className="text-xs font-medium text-rose-600">{errors.firstName.message}</p>}
                    </div>

                    {/* Last Name */}
                    <div className="grid gap-1.5">
                        <Input
                            label="Last name (optional)"
                            labelPlacement="outside"
                            placeholder="Doe"
                            startContent={<UserRound size={17} className="text-[var(--muted)]" />}
                            {...register("lastName")}
                        />
                        {errors.lastName && <p className="text-xs font-medium text-rose-600">{errors.lastName.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="grid gap-1.5 sm:col-span-2">
                        <Input
                            label="Email"
                            labelPlacement="outside"
                            placeholder="jane@example.com"
                            type="email"
                            startContent={<Mail size={17} className="text-[var(--muted)]" />}
                            {...register("email")}
                        />
                        {errors.email && <p className="text-xs font-medium text-rose-600">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="grid gap-1.5 sm:col-span-2">
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

                    {/* Photo URL */}
                    <div className="grid gap-1.5 sm:col-span-2">
                        <Input
                            label="Photo URL (optional)"
                            labelPlacement="outside"
                            placeholder="https://..."
                            startContent={<ImagePlus size={17} className="text-[var(--muted)]" />}
                            {...register("photoURL")}
                        />
                        {errors.photoURL && <p className="text-xs font-medium text-rose-600">{errors.photoURL.message}</p>}
                    </div>

                    {/* Role */}
                    <div className="sm:col-span-2 mt-1">
                        <RadioGroup
                            label="I want to join as"
                            value={watch("role")}
                            onValueChange={(value) => setValue("role", value)}
                            orientation="horizontal"
                        >
                            <Radio value="tenant">Tenant</Radio>
                            <Radio value="owner">Owner</Radio>
                        </RadioGroup>
                    </div>

                    <Button type="submit" isLoading={isSubmitting} className="mt-2 h-12 bg-[var(--brand)] font-black text-white rounded-xl sm:col-span-2">
                        Create account
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-[var(--muted)]">Already have an account? <Link className="font-black text-[var(--brand)]" href="/login">Sign in</Link></p>
            </section>
        </div>
    );
}
