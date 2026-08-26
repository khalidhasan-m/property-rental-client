"use client";
import { useRef, useState } from "react";
import { Button, Input } from "@heroui/react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api, getApiErrorMessage } from "@/lib/api";

const profileSchema = z.object({
    name: z.string().min(2, "Enter your full name"),
    phone: z.string().min(6, "Enter a valid phone number").optional().or(z.literal("")),
    photoURL: z.string().url("Enter a valid URL").optional().or(z.literal(""))
});

export default function ProfilePage() {
    const { user, setUser } = useAuth();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(profileSchema),
        values: { name: user?.name || "", phone: user?.phone || "", photoURL: user?.photoURL || "" }
    });

    // Live preview as user types a URL or after upload
    const watchedPhotoURL = useWatch({ control, name: "photoURL" });
    const previewURL = watchedPhotoURL || user?.photoURL || "";
    const initials = user?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be under 5 MB");
            return;
        }

        setUploading(true);
        try {
            // Convert to base64
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Upload to ImgBB via server
            const { data: uploadData } = await api.post("/uploads/avatar", { image: base64 });
            const newPhotoURL = uploadData.data;

            // Fill the form field only (don't auto-save)
            setValue("photoURL", newPhotoURL, { shouldValidate: true });
            toast.success("Photo uploaded! Click Save changes to apply.");
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Upload failed"));
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleRemovePhoto = () => {
        setValue("photoURL", "", { shouldValidate: true });
        toast.success("Photo removed! Click Save changes to apply.");
    };

    const onSubmit = async (values) => {
        try {
            const { data } = await api.patch("/auth/profile", values);
            setUser(data.data);
            toast.success("Profile updated");
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    };

    return (
        <div>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Account settings</span>
            <h1 className="mt-2 text-3xl font-black tracking-[-.04em]">Your profile</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Keep your details current so rental communication stays straightforward.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-7 max-w-xl rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                {/* Avatar preview */}
                <div className="mb-6 flex items-center gap-4">
                    <div className="relative shrink-0 group">
                        {previewURL ? (
                            <>
                                <img
                                    src={previewURL}
                                    alt={user?.name}
                                    onError={(e) => { 
                                        e.target.style.display = "none"; 
                                        if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = "none";
                                        if (e.target.nextElementSibling?.nextElementSibling) e.target.nextElementSibling.nextElementSibling.style.display = "grid"; 
                                    }}
                                    className="size-16 rounded-full object-cover ring-2 ring-emerald-500/30 shadow-md transition-opacity"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemovePhoto}
                                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                                    title="Remove photo"
                                >
                                    <X size={20} className="text-white" />
                                </button>
                            </>
                        ) : null}
                        <div
                            className="grid size-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-lg font-black text-white shadow-md ring-2 ring-emerald-500/20"
                            style={{ display: previewURL ? "none" : "grid" }}
                        >
                            {initials}
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-[var(--foreground)]">{user?.name}</p>
                        <p className="text-xs text-[var(--muted)] capitalize">{user?.role} · {user?.provider === "google" ? "Google account" : "Email account"}</p>
                    </div>
                </div>

                <div className="grid gap-5">
                    <div className="grid gap-1.5">
                        <Input label="Full name" labelPlacement="outside" placeholder="Your full name" {...register("name")}/>
                        {errors.name && <p className="text-xs font-medium text-rose-600">{errors.name.message}</p>}
                    </div>

                    <div className="grid gap-1.5">
                        <Input label="Contact number" labelPlacement="outside" placeholder="+1 (555) 000-0000" {...register("phone")}/>
                        {errors.phone && <p className="text-xs font-medium text-rose-600">{errors.phone.message}</p>}
                    </div>

                    {/* Photo URL + Upload button side by side */}
                    <div className="grid gap-1.5">
                        <div className="flex items-end gap-2">
                            <div className="flex-1 grid gap-1.5">
                                <Input
                                    label="Photo URL"
                                    labelPlacement="outside"
                                    placeholder="https://..."
                                    {...register("photoURL")}
                                />
                            </div>
                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                            <Button
                                type="button"
                                variant="flat"
                                isIconOnly={false}
                                isLoading={uploading}
                                onPress={() => fileInputRef.current?.click()}
                                className="h-[40px] shrink-0 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 font-bold text-sm text-[var(--foreground)] hover:bg-[var(--line)] transition-colors"
                                startContent={uploading ? null : <Upload size={15} />}
                            >
                                {uploading ? "Uploading…" : "Upload"}
                            </Button>
                        </div>
                        {errors.photoURL && <p className="text-xs font-medium text-rose-600">{errors.photoURL.message}</p>}
                    </div>

                    <div className="rounded-2xl bg-emerald-50 p-4 text-sm dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900">
                        <p className="font-black">Role: <span className="capitalize">{user?.role}</span></p>
                        <p className="mt-1 text-xs text-[var(--muted)]">Roles are managed by administrators to keep marketplace access secure.</p>
                    </div>

                    <Button type="submit" isLoading={isSubmitting} className="w-fit bg-[var(--brand)] font-bold text-white rounded-xl">
                        Save changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
