"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea } from "@heroui/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { api, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/LoadingState";

const list = (text) => text ? text.split(",").map((item) => item.trim()).filter(Boolean) : [];

export default function EditPropertyPage({ params }) {
    const router = useRouter();
    const [id, setId] = useState("");
    const [property, setProperty] = useState(null);
    const { register, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    useEffect(() => {
        params.then(({ id: propertyId }) => {
            setId(propertyId);
            api.get(`/properties/mine/${propertyId}`).then(({ data }) => {
                const p = data.data;
                setProperty(p);
                reset({
                    title: p.title,
                    description: p.description,
                    location: p.location,
                    rent: p.rent,
                    bedrooms: p.bedrooms,
                    bathrooms: p.bathrooms,
                    propertySize: p.propertySize,
                    amenitiesText: (p.amenities || []).join(", "),
                    extraFeaturesText: (p.extraFeatures || []).join(", ")
                });
            }).catch(() => setProperty(null));
        });
    }, [params, reset]);

    const onSubmit = async (values) => {
        if (!property) return;
        try {
            await api.patch(`/properties/${id}`, {
                ...values,
                amenities: list(values.amenitiesText),
                extraFeatures: list(values.extraFeaturesText),
                propertyType: property.propertyType,
                rentType: property.rentType,
                images: property.images
            });
            toast.success("Property updated and returned to pending review");
            router.push("/dashboard/owner/properties");
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    };

    if (!property) return <LoadingState label="Loading property editor…"/>;

    return (
        <div>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Owner dashboard</span>
            <h1 className="mt-2 text-3xl font-black tracking-[-.04em]">Update property</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Changing a listing returns it to pending status for a fresh admin review.</p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="mt-7 grid max-w-4xl gap-6 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:grid-cols-2 sm:p-7 shadow-sm">
                <div className="sm:col-span-2 grid gap-1.5">
                    <Input label="Property title" labelPlacement="outside" placeholder="Property title" {...register("title", { required: "Title is required" })}/>
                    {errors.title && <p className="text-xs font-semibold text-rose-600">{errors.title.message}</p>}
                </div>
                <div className="sm:col-span-2 grid gap-1.5">
                    <Textarea label="Description" labelPlacement="outside" placeholder="Property description" minRows={5} {...register("description", { required: "Description is required" })}/>
                    {errors.description && <p className="text-xs font-semibold text-rose-600">{errors.description.message}</p>}
                </div>
                <div className="grid gap-1.5">
                    <Input label="Location" labelPlacement="outside" placeholder="Location" {...register("location", { required: "Location is required" })}/>
                    {errors.location && <p className="text-xs font-semibold text-rose-600">{errors.location.message}</p>}
                </div>
                <div className="grid gap-1.5">
                    <Input label="Rent (USD)" labelPlacement="outside" type="number" placeholder="Rent amount" {...register("rent", { valueAsNumber: true, required: "Rent is required", min: { value: 1, message: "Rent must be greater than 0" } })}/>
                    {errors.rent && <p className="text-xs font-semibold text-rose-600">{errors.rent.message}</p>}
                </div>
                <div className="grid gap-1.5">
                    <Input label="Bedrooms" labelPlacement="outside" type="number" min="0" step="1" placeholder="Bedrooms count" {...register("bedrooms", { valueAsNumber: true, required: "Bedrooms count is required", min: { value: 0, message: "Bedrooms cannot be negative" }, validate: (v) => Number.isInteger(v) || "Must be a whole number" })}/>
                    {errors.bedrooms && <p className="text-xs font-semibold text-rose-600">{errors.bedrooms.message}</p>}
                </div>
                <div className="grid gap-1.5">
                    <Input label="Bathrooms" labelPlacement="outside" type="number" min="0" step="1" placeholder="Bathrooms count" {...register("bathrooms", { valueAsNumber: true, required: "Bathrooms count is required", min: { value: 0, message: "Bathrooms cannot be negative" }, validate: (v) => Number.isInteger(v) || "Must be a whole number" })}/>
                    {errors.bathrooms && <p className="text-xs font-semibold text-rose-600">{errors.bathrooms.message}</p>}
                </div>
                <div className="grid gap-1.5">
                    <Input label="Property size (sq ft)" labelPlacement="outside" type="number" placeholder="Size in sq ft" {...register("propertySize", { valueAsNumber: true, required: "Property size is required", min: { value: 1, message: "Size must be greater than 0" } })}/>
                    {errors.propertySize && <p className="text-xs font-semibold text-rose-600">{errors.propertySize.message}</p>}
                </div>
                <div className="hidden sm:block"/>
                <div className="sm:col-span-2 grid gap-1.5">
                    <Input label="Amenities" labelPlacement="outside" description="Separate with commas" placeholder="Wi-Fi, Balcony, Security" {...register("amenitiesText")}/>
                </div>
                <div className="sm:col-span-2 grid gap-1.5">
                    <Input label="Extra features" labelPlacement="outside" description="Separate with commas" placeholder="Pet friendly, Parking" {...register("extraFeaturesText")}/>
                </div>
                <Button type="submit" isLoading={isSubmitting} className="h-12 bg-[var(--brand)] font-black text-white rounded-xl sm:col-span-2">
                    Save property changes
                </Button>
            </form>
        </div>
    );
}
