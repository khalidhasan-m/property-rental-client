"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bath, BedDouble, Copy, Heart, MapPin, Maximize2, Share2, Star } from "lucide-react";
import toast from "react-hot-toast";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingState } from "@/components/LoadingState";
import { ReviewForm } from "@/components/ReviewForm";
const bookingSchema = z.object({ moveInDate: z.string().min(1, "Choose a move-in date"), contactNumber: z.string().min(6, "Enter a valid number"), notes: z.string().max(1000).optional() });
export function PropertyDetailClient({ id }) {
    const router = useRouter();
    const { user } = useAuth();
    const [property, setProperty] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const form = useForm({ resolver: zodResolver(bookingSchema), defaultValues: { moveInDate: "", contactNumber: user?.phone || "", notes: "" } });
    useEffect(() => { Promise.all([api.get(`/properties/${id}`), api.get(`/reviews/${id}`)]).then(([p, r]) => { setProperty(p.data.data); setReviews(r.data.data || []); }).catch(() => setProperty(null)).finally(() => setLoading(false)); }, [id]);
    const share = async () => { await navigator.clipboard.writeText(window.location.href); toast.success("Property link copied to clipboard"); };
    const favorite = async () => { try {
        await api.post("/favorites", { propertyId: id });
        toast.success("Saved to your favorites");
    }
    catch (error) {
        toast.error(getApiErrorMessage(error));
    } };
    const submitBooking = async (values) => { setSubmitting(true); try {
        const { data } = await api.post("/bookings", { propertyId: id, ...values });
        toast.success("Booking created. Continue to payment.");
        setIsOpen(false);
        router.push(`/payment/${id}?bookingId=${data.data._id}`);
    }
    catch (error) {
        toast.error(getApiErrorMessage(error));
    }
    finally {
        setSubmitting(false);
    } };
    if (loading)
        return <LoadingState label="Loading property details…"/>;
    if (!property)
        return <div className="container-shell py-24 text-center"><h1 className="text-3xl font-black">Property unavailable</h1><p className="mt-3 text-[var(--muted)]">This listing may no longer be approved or available.</p></div>;
    const canBook = user?.role === "tenant";
    return <div className="container-shell py-10 sm:py-14"><div className="grid gap-8 lg:grid-cols-[1.35fr_.65fr]"><div><div className="grid gap-3 sm:grid-cols-2"><div className="relative aspect-[4/3] overflow-hidden rounded-3xl sm:row-span-2 sm:aspect-auto"><Image src={property.images[0]} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" alt={property.title}/></div>{property.images.slice(1, 3).map((image, index) => <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-3xl"><Image src={image} fill sizes="(max-width: 1024px) 50vw, 30vw" className="object-cover" alt={`${property.title} ${index + 2}`}/></div>)}</div><div className="mt-8 flex flex-wrap items-start justify-between gap-4"><div><p className="flex items-center gap-1.5 text-sm font-bold text-[var(--muted)]"><MapPin size={16} className="text-[var(--brand)]"/>{property.location}</p><h1 className="mt-2 text-4xl font-black tracking-[-.05em] sm:text-5xl">{property.title}</h1><p className="mt-3 inline-flex items-center gap-1 text-sm font-bold"><Star size={17} className="fill-amber-400 text-amber-400"/>{property.averageRating || "New"} <span className="font-medium text-[var(--muted)]">({property.reviewCount || 0} reviews)</span></p></div><div className="flex gap-2"><Button isIconOnly variant="flat" aria-label="Copy link" onPress={share}><Copy size={18}/></Button><Button isIconOnly variant="flat" aria-label="Share on WhatsApp" onPress={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${property.title} ${window.location.href}`)}`, "_blank")}><Share2 size={18}/></Button><Button isIconOnly variant="flat" aria-label="Add to favorites" onPress={favorite}><Heart size={18}/></Button></div></div><div className="mt-7 grid grid-cols-3 gap-3 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 text-center"><div><BedDouble className="mx-auto text-[var(--brand)]" size={20}/><p className="mt-2 text-sm font-black">{property.bedrooms} beds</p></div><div><Bath className="mx-auto text-[var(--brand)]" size={20}/><p className="mt-2 text-sm font-black">{property.bathrooms} baths</p></div><div><Maximize2 className="mx-auto text-[var(--brand)]" size={20}/><p className="mt-2 text-sm font-black">{property.propertySize} sq ft</p></div></div><section className="mt-8"><h2 className="text-2xl font-black">About this place</h2><p className="mt-3 whitespace-pre-wrap leading-7 text-[var(--muted)]">{property.description}</p></section><section className="mt-8"><h2 className="text-2xl font-black">What&apos;s included</h2><div className="mt-4 flex flex-wrap gap-2">{property.amenities.map((item) => <span key={item} className="rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">{item}</span>)}</div></section><section className="mt-10"><h2 className="text-2xl font-black">Tenant reviews</h2>{reviews.length ? <div className="mt-5 grid gap-4">{reviews.map((review) => <article key={review._id} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5"><div className="flex flex-wrap justify-between gap-2"><div><p className="font-black">{review.user.name}</p><p className="text-xs text-[var(--muted)]">{review.user.email}</p></div><span className="inline-flex items-center gap-1 font-bold"><Star size={15} className="fill-amber-400 text-amber-400"/>{review.rating}/5</span></div><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{review.comment}</p><time className="mt-3 block text-xs font-semibold text-[var(--muted)]">{new Date(review.createdAt).toLocaleDateString()}</time></article>)}</div> : <p className="mt-4 text-sm text-[var(--muted)]">Be the first tenant to review this property after a completed booking.</p>}{user?.role === "tenant" ? <ReviewForm propertyId={id} onSaved={() => { api.get(`/reviews/${id}`).then(({ data }) => setReviews(data.data || [])); }}/> : null}</section></div>
        <aside className="h-fit rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xl shadow-emerald-950/5 lg:sticky lg:top-24"><p className="text-3xl font-black text-[var(--brand)]">${property.rent.toLocaleString()}<span className="text-base font-medium text-[var(--muted)]"> / {property.rentType.replace("ly", "")}</span></p><p className="mt-3 text-sm leading-6 text-[var(--muted)]">Request this rental with secure Stripe payment. The owner will review your booking afterwards.</p><Button className="mt-6 w-full bg-[var(--brand)] font-black text-white" onPress={() => { if (!user)
        return router.push("/login"); if (!canBook)
        return toast.error("Only tenant accounts can book properties."); setIsOpen(true); }}>Book property</Button><p className="mt-4 text-center text-xs font-semibold text-[var(--muted)]">Reservation amount due now. Owner approval follows payment.</p></aside></div>
    <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="lg" placement="center"><ModalContent>{(onClose) => <form onSubmit={form.handleSubmit(submitBooking)}><ModalHeader>Confirm your booking request</ModalHeader><ModalBody><p className="text-sm text-[var(--muted)]">Your booking will be submitted for <strong>{property.title}</strong>.</p><label className="grid gap-1 text-sm font-bold">Move-in date<input type="date" min={new Date().toISOString().split("T")[0]} className="rounded-xl border border-[var(--line)] bg-transparent px-3 py-2 outline-none focus:border-[var(--brand)]" {...form.register("moveInDate")}/></label>{form.formState.errors.moveInDate && <p className="text-xs text-rose-600">{form.formState.errors.moveInDate.message}</p>}<label className="grid gap-1 text-sm font-bold">Contact number<input className="rounded-xl border border-[var(--line)] bg-transparent px-3 py-2 outline-none focus:border-[var(--brand)]" {...form.register("contactNumber")}/></label>{form.formState.errors.contactNumber && <p className="text-xs text-rose-600">{form.formState.errors.contactNumber.message}</p>}<Textarea label="Additional notes" {...form.register("notes")}/></ModalBody><ModalFooter><Button variant="light" onPress={onClose}>Cancel</Button><Button type="submit" isLoading={submitting} className="bg-[var(--brand)] font-bold text-white">Continue to payment</Button></ModalFooter></form>}</ModalContent></Modal>
  </div>;
}
