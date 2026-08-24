"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, X } from "lucide-react";
import toast from "react-hot-toast";
import { api, getApiErrorMessage } from "@/lib/api";

const schema = z.object({
    title: z.string().trim().min(5, "Title must be at least 5 characters"),
    description: z.string().trim().min(30, "Description must be at least 30 characters"),
    location: z.string().trim().min(2, "Location is required"),
    propertyType: z.string().trim().min(2, "Select a valid property type"),
    rent: z.coerce.number({ invalid_type_error: "Enter a valid rent amount" }).positive("Rent must be greater than 0"),
    rentType: z.enum(["monthly", "weekly", "daily"]),
    bedrooms: z.coerce.number({ invalid_type_error: "Enter bedrooms count" }).int("Bedrooms must be a whole number").min(0, "Bedrooms must be 0 or more"),
    bathrooms: z.coerce.number({ invalid_type_error: "Enter bathrooms count" }).int("Bathrooms must be a whole number").min(0, "Bathrooms must be 0 or more"),
    propertySize: z.coerce.number({ invalid_type_error: "Enter property size" }).positive("Property size must be greater than 0"),
    amenitiesText: z.string().optional().default(""),
    extraFeaturesText: z.string().optional().default("")
});

const toList = (value) => value ? value.split(",").map((item) => item.trim()).filter(Boolean) : [];
const processImage = (file) => {
    return new Promise((resolve, reject) => {
        // Validate type
        if (!file.type.startsWith("image/")) {
            return reject(new Error(`"${file.name}" is not a valid image file.`));
        }
        // Validate size (e.g. max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return reject(new Error(`"${file.name}" is too large (max 10MB).`));
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const MAX_DIMENSION = 1200;
                let { width, height } = img;

                if (width > height && width > MAX_DIMENSION) {
                    height = Math.round((height * MAX_DIMENSION) / width);
                    width = MAX_DIMENSION;
                } else if (height > MAX_DIMENSION) {
                    width = Math.round((width * MAX_DIMENSION) / height);
                    height = MAX_DIMENSION;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to compressed jpeg base64
                resolve(canvas.toDataURL("image/jpeg", 0.7)); // 70% quality
            };
            img.onerror = () => reject(new Error(`Failed to process "${file.name}".`));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error(`Failed to read "${file.name}".`));
        reader.readAsDataURL(file);
    });
};

export default function AddPropertyPage() {
    const router = useRouter();
    const [files, setFiles] = useState([]);
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            propertyType: "Apartment",
            rentType: "monthly",
            bedrooms: 1,
            bathrooms: 1,
            amenitiesText: "",
            extraFeaturesText: ""
        }
    });

    const handleFileSelect = (event) => {
        const selected = Array.from(event.target.files || []);
        if (!selected.length) return;

        setFiles((prev) => {
            const combined = [...prev, ...selected];
            // Deduplicate by name and size since we don't process until submit
            const unique = [];
            const seen = new Set();
            for (const file of combined) {
                const key = `${file.name}-${file.size}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    unique.push(file);
                }
            }
            if (unique.length > 8) {
                toast.error("Maximum 8 images allowed per property.");
            }
            return unique.slice(0, 8);
        });

        // Reset input value so same files can be chosen again if needed
        event.target.value = "";
    };

    const removeFile = (indexToRemove) => {
        setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const onSubmit = async (values) => {
        if (!files.length) return toast.error("Please add at least one property image");
        try {
            toast.loading("Compressing images & submitting...", { id: "upload" });
            const processedImages = [];
            for (const file of files) {
                try {
                    const base64 = await processImage(file);
                    processedImages.push(base64);
                } catch (err) {
                    toast.dismiss("upload");
                    return toast.error(err.message);
                }
            }

            const upload = await api.post("/uploads/images", { images: processedImages });
            await api.post("/properties", {
                ...values,
                rentType: String(values.rentType || "monthly").toLowerCase(),
                amenities: toList(values.amenitiesText),
                extraFeatures: toList(values.extraFeaturesText),
                images: upload.data.data
            });
            toast.success("Property submitted for admin approval", { id: "upload" });
            router.push("/dashboard/owner/properties");
        } catch (error) {
            toast.error(getApiErrorMessage(error), { id: "upload" });
        }
    };

    return (
        <div>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">
                Owner dashboard
            </span>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em]">List a new property</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
                Your listing will be submitted with a <strong>pending</strong> status until an administrator reviews it.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-7 grid max-w-4xl gap-6 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:grid-cols-2 sm:p-7 shadow-sm">
                {/* Title */}
                <div className="sm:col-span-2 grid gap-1.5">
                    <Input
                        label="Property title"
                        labelPlacement="outside"
                        placeholder="e.g. Modern Minimalist Apartment in City Center"
                        {...register("title")}
                    />
                    {errors.title && <p className="text-xs font-semibold text-rose-600">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div className="sm:col-span-2 grid gap-1.5">
                    <Textarea
                        label="Description"
                        labelPlacement="outside"
                        placeholder="Provide a detailed description of your property, features, and surroundings..."
                        minRows={5}
                        {...register("description")}
                    />
                    {errors.description && <p className="text-xs font-semibold text-rose-600">{errors.description.message}</p>}
                </div>

                {/* Location */}
                <div className="grid gap-1.5">
                    <Input
                        label="Location"
                        labelPlacement="outside"
                        placeholder="City, Neighborhood"
                        {...register("location")}
                    />
                    {errors.location && <p className="text-xs font-semibold text-rose-600">{errors.location.message}</p>}
                </div>

                {/* Property type */}
                <div className="grid gap-1.5">
                    <Select
                        label="Property type"
                        labelPlacement="outside"
                        selectedKeys={[watch("propertyType")]}
                        onSelectionChange={(keys) => {
                            const val = Array.from(keys)[0];
                            if (val) setValue("propertyType", String(val), { shouldValidate: true });
                        }}
                    >
                        <SelectItem key="Apartment">Apartment</SelectItem>
                        <SelectItem key="House">House</SelectItem>
                        <SelectItem key="Studio">Studio</SelectItem>
                        <SelectItem key="Room">Room</SelectItem>
                    </Select>
                    {errors.propertyType && <p className="text-xs font-semibold text-rose-600">{errors.propertyType.message}</p>}
                </div>

                {/* Rent */}
                <div className="grid gap-1.5">
                    <Input
                        label="Rent (USD)"
                        labelPlacement="outside"
                        type="number"
                        placeholder="1200"
                        {...register("rent")}
                    />
                    {errors.rent && <p className="text-xs font-semibold text-rose-600">{errors.rent.message}</p>}
                </div>

                {/* Rent type */}
                <div className="grid gap-1.5">
                    <Select
                        label="Rent type"
                        labelPlacement="outside"
                        selectedKeys={[watch("rentType")]}
                        onSelectionChange={(keys) => {
                            const val = Array.from(keys)[0];
                            if (val) setValue("rentType", String(val), { shouldValidate: true });
                        }}
                    >
                        <SelectItem key="monthly">Monthly</SelectItem>
                        <SelectItem key="weekly">Weekly</SelectItem>
                        <SelectItem key="daily">Daily</SelectItem>
                    </Select>
                    {errors.rentType && <p className="text-xs font-semibold text-rose-600">{errors.rentType.message}</p>}
                </div>

                {/* Bedrooms */}
                <div className="grid gap-1.5">
                    <Input
                        label="Bedrooms"
                        labelPlacement="outside"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="2"
                        {...register("bedrooms")}
                    />
                    {errors.bedrooms && <p className="text-xs font-semibold text-rose-600">{errors.bedrooms.message}</p>}
                </div>

                {/* Bathrooms */}
                <div className="grid gap-1.5">
                    <Input
                        label="Bathrooms"
                        labelPlacement="outside"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="1"
                        {...register("bathrooms")}
                    />
                    {errors.bathrooms && <p className="text-xs font-semibold text-rose-600">{errors.bathrooms.message}</p>}
                </div>

                {/* Property size */}
                <div className="grid gap-1.5">
                    <Input
                        label="Property size (sq ft)"
                        labelPlacement="outside"
                        type="number"
                        placeholder="850"
                        {...register("propertySize")}
                    />
                    {errors.propertySize && <p className="text-xs font-semibold text-rose-600">{errors.propertySize.message}</p>}
                </div>

                <div className="hidden sm:block" />

                {/* Amenities */}
                <div className="sm:col-span-2 grid gap-1.5">
                    <Input
                        label="Amenities"
                        labelPlacement="outside"
                        description="Separate items with commas"
                        placeholder="Wi-Fi, Balcony, Security, Elevator"
                        {...register("amenitiesText")}
                    />
                </div>

                {/* Extra features */}
                <div className="sm:col-span-2 grid gap-1.5">
                    <Input
                        label="Extra features"
                        labelPlacement="outside"
                        description="Separate items with commas"
                        placeholder="Pet friendly, Near metro station, Parking"
                        {...register("extraFeaturesText")}
                    />
                </div>

                {/* Images Upload Section */}
                <div className="sm:col-span-2 grid gap-3">
                    <label className="grid cursor-pointer place-items-center rounded-2xl border border-dashed border-[var(--line)] bg-emerald-50/50 p-6 text-center dark:bg-emerald-950/30 hover:border-[var(--brand)] transition-colors">
                        <ImagePlus className="text-[var(--brand)]" size={32} />
                        <span className="mt-2 text-sm font-black">Add property images</span>
                        <span className="mt-1 text-xs text-[var(--muted)]">
                            Select multiple images or add them in steps (up to 8 images total). ({files.length}/8 added)
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="sr-only"
                            onChange={handleFileSelect}
                        />
                    </label>

                    {files.length > 0 && (
                        <div className="flex flex-wrap gap-3 pt-1">
                            {files.map((file, idx) => (
                                <div
                                    key={`${file.name}-${file.lastModified}-${idx}`}
                                    className="group relative flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-bold text-[var(--foreground)] shadow-xs"
                                >
                                    <span className="max-w-[160px] truncate">{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(idx)}
                                        className="rounded-full p-0.5 text-[var(--muted)] hover:bg-rose-100 hover:text-rose-600 transition-colors"
                                        title="Remove image"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="h-12 bg-[var(--brand)] font-black text-white rounded-xl sm:col-span-2 hover:bg-[var(--brand-deep)] transition-colors"
                >
                    Submit for approval
                </Button>
            </form>
        </div>
    );
}
