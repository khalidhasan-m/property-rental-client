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
const schema = z.object({ title: z.string().min(5), description: z.string().min(30), location: z.string().min(2), propertyType: z.string().min(2), rent: z.coerce.number().positive(), rentType: z.enum(["monthly", "weekly", "daily"]), bedrooms: z.coerce.number().int().min(0), bathrooms: z.coerce.number().min(0), propertySize: z.coerce.number().positive(), amenitiesText: z.string(), extraFeaturesText: z.string() });
const toList = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);
const toBase64 = (file) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); });
export default function AddPropertyPage() {
    const router = useRouter();
    const [files, setFiles] = useState([]);
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm({ resolver: zodResolver(schema), defaultValues: { propertyType: "Apartment", rentType: "monthly", bedrooms: 1, bathrooms: 1, amenitiesText: "", extraFeaturesText: "" } });
    const onSubmit = async (values) => { if (!files.length)
        return toast.error("Add at least one property image"); try {
        const images = await Promise.all(files.map(toBase64));
        const upload = await api.post("/uploads/images", { images });
        await api.post("/properties", { ...values, amenities: toList(values.amenitiesText), extraFeatures: toList(values.extraFeaturesText), images: upload.data.data });
        toast.success("Property submitted for admin approval");
        router.push("/dashboard/owner/properties");
    }
    catch (error) {
        toast.error(getApiErrorMessage(error));
    } };
    return <div><span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Owner dashboard</span><h1 className="mt-2 text-3xl font-black tracking-[-.04em]">List a new property</h1><p className="mt-2 text-sm text-[var(--muted)]">Your listing will be submitted with a <strong>pending</strong> status until an administrator reviews it.</p><form onSubmit={handleSubmit(onSubmit)} className="mt-7 grid max-w-4xl gap-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:grid-cols-2 sm:p-7"><div className="sm:col-span-2"><Input label="Property title" {...register("title")}/>{errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title.message}</p>}</div><div className="sm:col-span-2"><Textarea label="Description" minRows={5} {...register("description")}/>{errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description.message}</p>}</div><Input label="Location" {...register("location")}/><Select label="Property type" selectedKeys={[watch("propertyType")]} onSelectionChange={(keys) => setValue("propertyType", Array.from(keys)[0])}><SelectItem key="Apartment">Apartment</SelectItem><SelectItem key="House">House</SelectItem><SelectItem key="Studio">Studio</SelectItem><SelectItem key="Room">Room</SelectItem></Select><Input label="Rent" type="number" {...register("rent")}/><Select label="Rent type" selectedKeys={[watch("rentType")]} onSelectionChange={(keys) => setValue("rentType", Array.from(keys)[0])}><SelectItem key="monthly">Monthly</SelectItem><SelectItem key="weekly">Weekly</SelectItem><SelectItem key="daily">Daily</SelectItem></Select><Input label="Bedrooms" type="number" {...register("bedrooms")}/><Input label="Bathrooms" type="number" step="0.5" {...register("bathrooms")}/><Input label="Property size (sq ft)" type="number" {...register("propertySize")}/><div className="hidden sm:block"/><div className="sm:col-span-2"><Input label="Amenities" description="Separate items with commas" placeholder="Wi-Fi, Balcony, Security" {...register("amenitiesText")}/></div><div className="sm:col-span-2"><Input label="Extra features" description="Separate items with commas" placeholder="Pet friendly, Near metro" {...register("extraFeaturesText")}/></div><div className="sm:col-span-2"><label className="grid cursor-pointer place-items-center rounded-2xl border border-dashed border-[var(--line)] bg-emerald-50/50 p-6 text-center dark:bg-emerald-950/30"><ImagePlus className="text-[var(--brand)]"/><span className="mt-2 text-sm font-black">Add property images</span><span className="mt-1 text-xs text-[var(--muted)]">Select up to 8 images. They upload securely to imgbb.</span><input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => setFiles(Array.from(event.target.files || []).slice(0, 8))}/></label>{files.length ? <div className="mt-3 flex flex-wrap gap-2">{files.map((file) => <span key={`${file.name}${file.lastModified}`} className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900"><span className="max-w-40 truncate">{file.name}</span><button type="button" onClick={() => setFiles((old) => old.filter((item) => item !== file))}><X size={13}/></button></span>)}</div> : null}</div><Button type="submit" isLoading={isSubmitting} className="h-12 bg-[var(--brand)] font-black text-white sm:col-span-2">Submit for approval</Button></form></div>;
}
