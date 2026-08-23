"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea } from "@heroui/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { api, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/LoadingState";
const list = (text) => text.split(",").map((item) => item.trim()).filter(Boolean);
export default function EditPropertyPage({ params }) {
    const router = useRouter();
    const [id, setId] = useState("");
    const [property, setProperty] = useState(null);
    const { register, reset, handleSubmit, formState: { isSubmitting } } = useForm();
    useEffect(() => { params.then(({ id: propertyId }) => { setId(propertyId); api.get(`/properties/mine/${propertyId}`).then(({ data }) => { const p = data.data; setProperty(p); reset({ title: p.title, description: p.description, location: p.location, rent: p.rent, bedrooms: p.bedrooms, bathrooms: p.bathrooms, propertySize: p.propertySize, amenitiesText: p.amenities.join(", "), extraFeaturesText: (p.extraFeatures || []).join(", ") }); }).catch(() => setProperty(null)); }); }, [params, reset]);
    const onSubmit = async (values) => { if (!property)
        return; try {
        await api.patch(`/properties/${id}`, { ...values, amenities: list(values.amenitiesText), extraFeatures: list(values.extraFeaturesText), propertyType: property.propertyType, rentType: property.rentType, images: property.images });
        toast.success("Property updated and returned to pending review");
        router.push("/dashboard/owner/properties");
    }
    catch (error) {
        toast.error(getApiErrorMessage(error));
    } };
    if (!property)
        return <LoadingState label="Loading property editor…"/>;
    return <div><span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Owner dashboard</span><h1 className="mt-2 text-3xl font-black tracking-[-.04em]">Update property</h1><p className="mt-2 text-sm text-[var(--muted)]">Changing a listing returns it to pending status for a fresh admin review.</p><form onSubmit={handleSubmit(onSubmit)} className="mt-7 grid max-w-4xl gap-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:grid-cols-2 sm:p-7"><div className="sm:col-span-2"><Input label="Property title" {...register("title", { required: true })}/></div><div className="sm:col-span-2"><Textarea label="Description" minRows={5} {...register("description", { required: true })}/></div><Input label="Location" {...register("location", { required: true })}/><Input label="Rent" type="number" {...register("rent", { valueAsNumber: true })}/><Input label="Bedrooms" type="number" {...register("bedrooms", { valueAsNumber: true })}/><Input label="Bathrooms" type="number" {...register("bathrooms", { valueAsNumber: true })}/><Input label="Property size (sq ft)" type="number" {...register("propertySize", { valueAsNumber: true })}/><div className="hidden sm:block"/><div className="sm:col-span-2"><Input label="Amenities" description="Separate with commas" {...register("amenitiesText")}/></div><div className="sm:col-span-2"><Input label="Extra features" description="Separate with commas" {...register("extraFeaturesText")}/></div><Button type="submit" isLoading={isSubmitting} className="bg-[var(--brand)] font-black text-white sm:col-span-2">Save property changes</Button></form></div>;
}
