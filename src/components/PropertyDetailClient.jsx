"use client";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bath, BedDouble, CalendarDays, Copy, Heart, MapPin, Maximize2, Phone, Share2, Star, CheckCircle2, ArrowRight, Globe, Mail, XIcon, ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import toast from "react-hot-toast";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingState } from "@/components/LoadingState";
import { ReviewForm } from "@/components/ReviewForm";

const bookingSchema = z.object({
    moveInDate: z.string().min(1, "Choose a move-in date"),
    contactNumber: z.string().min(6, "Enter a valid phone number"),
    notes: z.string().max(1000).optional(),
});

const RENT_LABELS = { monthly: "month", weekly: "week", daily: "day" };

export function PropertyDetailClient({ id }) {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [property, setProperty] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [liked, setLiked] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [isShareOpen, setIsShareOpen] = useState(false);

    // Lightbox modal state
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [galleryIndex, setGalleryIndex] = useState(0);

    const form = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: { moveInDate: "", contactNumber: user?.phone || "", notes: "" },
    });

    const fetchReviews = useCallback(() => {
        api.get(`/reviews/${id}`).then((r) => setReviews(r.data.data || []));
    }, [id]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace(`/login?redirect=/properties/${id}`);
            return;
        }
        if (authLoading || !user) return;
        Promise.all([
            api.get(`/properties/${id}`).then((p) => setProperty(p.data.data)),
            fetchReviews(),
        ]).catch(() => setProperty(null)).finally(() => setLoading(false));
    }, [authLoading, user, id, router, fetchReviews]);

// Load user's favorites to set initial liked state
useEffect(() => {
  if (authLoading || !user) return;
  api.get('/favorites')
    .then((r) => {
      const favs = r.data?.data || [];
      const isFav = favs.some((fav) => fav.propertyId === id || fav._id === id);
      setLiked(isFav);
    })
    .catch(() => {
      // ignore errors
    });
}, [authLoading, user, id]);

    const images = property?.images?.length ? property.images : ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"];

    const openLightbox = (index) => {
        setGalleryIndex(index);
        setIsGalleryOpen(true);
    };

    const nextImage = useCallback(() => {
        setGalleryIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    const prevImage = useCallback(() => {
        setGalleryIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    useEffect(() => {
        if (!isGalleryOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "Escape") setIsGalleryOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isGalleryOpen, nextImage, prevImage]);

    const share = async () => {
        const shareData = {
            title: property?.title || "Property Listing",
            text: `Check out ${property?.title || "this property"} on Nestora:`,
            url: window.location.href,
        };

        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                if (err.name !== "AbortError") {
                    setIsShareOpen(true);
                }
                return;
            }
        }
        setIsShareOpen(true);
    };

    const favorite = async () => {
        try {
            await api.post("/favorites", { propertyId: id });
            setLiked(true);
            toast.success("Saved to your favorites ❤️");
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    };

    const submitBooking = async (values) => {
        setSubmitting(true);
        try {
            const { data } = await api.post("/bookings", { propertyId: id, ...values });
            toast.success("Booking created! Redirecting to payment…");
            setIsOpen(false);
            router.push(`/payment/${id}?bookingId=${data.data._id}`);
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || (!user && !property)) return <LoadingState label="Checking your access…"/>;
    if (loading) return <LoadingState label="Loading property details…"/>;
    if (!property) return (
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
            <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950">
                <MapPin size={28}/>
            </div>
            <h1 className="text-3xl font-black">Property unavailable</h1>
            <p className="mt-3 text-[var(--muted)]">This listing may no longer be approved or available.</p>
            <Button className="mt-6 bg-[var(--brand)] font-bold text-white" onPress={() => router.push("/properties")}>
                Browse all properties
            </Button>
        </div>
    );

    const canBook = user?.role === "tenant";

    return (
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Single Big Featured Image */}
            <div
                className="relative w-full overflow-hidden rounded-3xl cursor-pointer group border border-[var(--line)] bg-[var(--surface-2)] shadow-md"
                style={{ height: "min(520px, 65vw)" }}
                onClick={() => openLightbox(activeImage)}
            >
                <Image
                    src={images[activeImage] || images[0]}
                    fill
                    sizes="100vw"
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                    alt={property.title}
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(activeImage);
                    }}
                    className="absolute bottom-4 right-4 flex items-center gap-2 rounded-2xl bg-black/75 px-4 py-2 text-xs font-black text-white shadow-xl backdrop-blur-md hover:bg-black hover:scale-105 transition-all"
                >
                    <Images size={16} />
                    <span>Fullscreen ({activeImage + 1}/{images.length})</span>
                </button>
            </div>

            {/* Clickable Thumbnails Row Directly Under Big Image */}
            {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                        <button
                            key={`${img}-${i}`}
                            type="button"
                            onClick={() => setActiveImage(i)}
                            className={`relative shrink-0 size-24 overflow-hidden rounded-2xl border-2 transition-all ${
                                i === activeImage
                                    ? "border-[var(--brand)] shadow-lg scale-102 ring-4 ring-emerald-500/20"
                                    : "border-[var(--line)] opacity-70 hover:opacity-100 hover:scale-102"
                            }`}
                        >
                            <Image src={img} fill className="object-cover" alt={`thumbnail ${i + 1}`} sizes="96px" />
                        </button>
                    ))}
                </div>
            )}

            {/* Content grid */}
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
                {/* Left: main content */}
                <div>
                    {/* Header row */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="rounded-full bg-[var(--brand-light)] px-3 py-1 text-xs font-bold text-[var(--brand)]">
                                    {property.propertyType}
                                </span>
                                {property.rentType && (
                                    <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-bold text-[var(--muted)] capitalize">
                                        {RENT_LABELS[property.rentType] || property.rentType}
                                    </span>
                                )}
                            </div>
                            <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--muted)]">
                                <MapPin size={15} className="text-[var(--brand)]"/> {property.location}
                            </p>
                            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{property.title}</h1>
                            {property.averageRating ? (
                                <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold">
                                    <Star size={16} className="fill-amber-400 text-amber-400"/>
                                    {property.averageRating}
                                    <span className="font-medium text-[var(--muted)]">({property.reviewCount || 0} review{property.reviewCount !== 1 ? "s" : ""})</span>
                                </p>
                            ) : (
                                <p className="mt-2 text-sm font-medium text-[var(--muted)]">No reviews yet — be the first!</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="flat" size="sm" aria-label="Share property" onPress={share} className="rounded-xl font-bold" startContent={<Share2 size={16} />}>
                                Share
                            </Button>
                            <Button isIconOnly size="sm" aria-label="Save to favorites" onPress={favorite}
                                className={`rounded-xl transition-all ${liked ? "bg-rose-100 text-rose-500 dark:bg-rose-950" : ""}`} variant="flat">
                                <Heart size={16} className={liked ? "fill-rose-500 text-rose-500" : ""}/>
                            </Button>
                        </div>
                    </div>

                    {/* Stats strip */}
                    <div className="mt-6 grid grid-cols-3 gap-3">
                        {[
                            { icon: BedDouble, value: `${property.bedrooms} bed${property.bedrooms !== 1 ? "s" : ""}`, label: "Bedrooms" },
                            { icon: Bath, value: `${property.bathrooms} bath${property.bathrooms !== 1 ? "s" : ""}`, label: "Bathrooms" },
                            { icon: Maximize2, value: `${property.propertySize} sq ft`, label: "Property area" },
                        ].map((stat) => (
                            <div key={stat.label} className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4 text-center">
                                <stat.icon size={20} className="mx-auto text-[var(--brand)] mb-1"/>
                                <p className="text-base font-black">{stat.value}</p>
                                <p className="text-xs text-[var(--muted)]">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <div className="mt-8">
                        <h2 className="text-xl font-black">About this home</h2>
                        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--muted)]">{property.description}</p>
                    </div>

                    {/* Amenities */}
                    {property.amenities?.length ? (
                        <div className="mt-8 border-t border-[var(--line)] pt-8">
                            <h2 className="text-xl font-black">Amenities</h2>
                            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {property.amenities.map((item) => (
                                    <div key={item} className="flex items-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 text-sm font-semibold">
                                        <CheckCircle2 size={16} className="text-[var(--brand)] shrink-0"/>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {/* Extra features */}
                    {property.extraFeatures?.length ? (
                        <div className="mt-8 border-t border-[var(--line)] pt-8">
                            <h2 className="text-xl font-black">Highlights & Features</h2>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {property.extraFeatures.map((feat) => (
                                    <span key={feat} className="rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                                        ✦ {feat}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {/* Reviews section */}
                    <div className="mt-8 border-t border-[var(--line)] pt-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black">Guest Reviews</h2>
                            {property.averageRating ? (
                                <div className="flex items-center gap-1.5 text-sm font-black">
                                    <Star size={16} className="fill-amber-400 text-amber-400"/>
                                    {property.averageRating} ({reviews.length})
                                </div>
                            ) : null}
                        </div>

                        {/* Review list */}
                        {reviews.length ? (
                            <div className="mt-6 space-y-4">
                                {reviews.map((rev) => (
                                    <div key={rev._id} className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="grid size-8 place-items-center rounded-full bg-[var(--brand-light)] text-xs font-black text-[var(--brand)]">
                                                    {rev.tenant?.name?.[0]?.toUpperCase() || "T"}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">{rev.user?.name || "Tenant"}</p>
                                                    <p className="text-xs text-[var(--muted)]">
                                                        {rev.user?.email} • {new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} size={13} className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"}/>
                                                ))}
                                            </div>
                                        </div>
                                        {rev.comment && <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{rev.comment}</p>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-[var(--muted)]">No reviews yet for this listing.</p>
                        )}

                        {/* Add Review Component (for tenants who booked) */}
                        {user?.role === "tenant" && (() => {
                            const existingReview = reviews.find(r => r.user?._id === user?._id);
                            return (
                                <ReviewForm 
                                    propertyId={id} 
                                    initialRating={existingReview?.rating} 
                                    initialComment={existingReview?.comment} 
                                    onReviewAdded={() => {
                                        fetchReviews();
                                    }} 
                                />
                            );
                        })()}
                    </div>
                </div>

                {/* Right: Booking sticky sidebar */}
                <aside className="lg:sticky lg:top-24 h-fit">
                    <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xl space-y-5">
                        <div className="flex items-baseline justify-between border-b border-[var(--line)] pb-4">
                            <div>
                                <span className="text-3xl font-black tracking-tight text-[var(--brand)]">${property.rent?.toLocaleString()}</span>
                                <span className="text-sm font-semibold text-[var(--muted)]"> /{RENT_LABELS[property.rentType] || property.rentType || "month"}</span>
                            </div>
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                Available
                            </span>
                        </div>

                        <div className="space-y-3 text-xs text-[var(--muted)]">
                            <div className="flex justify-between font-semibold">
                                <span>Security Deposit</span>
                                <span className="text-[var(--foreground)]">$0 (Included)</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <span>Verification</span>
                                <span className="text-emerald-600 font-bold">Verified Listing ✓</span>
                            </div>
                        </div>

                        {canBook ? (
                            <Button
                                className="w-full h-12 rounded-2xl bg-[var(--brand)] text-sm font-black text-white shadow-lg hover:bg-[var(--brand-deep)] transition-all"
                                onPress={() => setIsOpen(true)}
                            >
                                Request Booking Now
                            </Button>
                        ) : user?.role === "owner" ? (
                            <p className="text-center text-xs font-semibold text-[var(--muted)] bg-[var(--surface-2)] p-3 rounded-xl">
                                Owner accounts cannot book properties.
                            </p>
                        ) : (
                            <p className="text-center text-xs font-semibold text-[var(--muted)] bg-[var(--surface-2)] p-3 rounded-xl">
                                <a className="font-bold text-[var(--brand)]" href="/login">Sign in</a> to book this property.
                            </p>
                        )}
                    </div>
                </aside>
            </div>

            {/* Booking modal */}
            <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="lg" placement="center" scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={form.handleSubmit(submitBooking)}>
                            <ModalHeader className="flex flex-col gap-1">
                                <span className="text-lg font-black">Confirm booking request</span>
                                <span className="text-sm font-medium text-[var(--muted)]">{property.title}</span>
                            </ModalHeader>
                            <ModalBody className="gap-4 pb-2">
                                {/* User summary */}
                                <div className="flex items-center gap-3 rounded-2xl bg-[var(--surface-2)] p-4">
                                    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-black text-white">
                                        {user?.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-black">{user?.name}</p>
                                        <p className="text-sm text-[var(--muted)]">{user?.email}</p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <p className="text-xl font-black text-[var(--brand)]">${property.rent?.toLocaleString()}</p>
                                        <p className="text-xs text-[var(--muted)]">/{RENT_LABELS[property.rentType] || property.rentType || "month"}</p>
                                    </div>
                                </div>

                                {/* Move-in date */}
                                <div className="grid gap-1.5">
                                    <label className="text-sm font-bold flex items-center gap-2">
                                        <CalendarDays size={15} className="text-[var(--brand)]"/>
                                        Move-in date
                                    </label>
                                    <input type="date"
                                        min={new Date().toISOString().split("T")[0]}
                                        className="h-10 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-sm font-semibold outline-none transition focus:border-[var(--brand)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--brand)_18%,transparent)]"
                                        {...form.register("moveInDate")}
                                    />
                                    {form.formState.errors.moveInDate && (
                                        <p className="text-xs font-medium text-rose-600">{form.formState.errors.moveInDate.message}</p>
                                    )}
                                </div>

                                {/* Contact number */}
                                <div className="grid gap-1.5">
                                    <Input
                                        label="Contact number"
                                        labelPlacement="outside"
                                        placeholder="+880 17XX XXXXXX"
                                        startContent={<Phone size={15} className="text-[var(--muted)]"/>}
                                        {...form.register("contactNumber")}
                                    />
                                    {form.formState.errors.contactNumber && (
                                        <p className="text-xs font-medium text-rose-600">{form.formState.errors.contactNumber.message}</p>
                                    )}
                                </div>

                                {/* Notes */}
                                <div className="grid gap-1.5">
                                    <Textarea
                                        label="Additional notes (optional)"
                                        labelPlacement="outside"
                                        placeholder="Any special requirements, questions, or notes for the owner…"
                                        minRows={3}
                                        {...form.register("notes")}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose} className="rounded-xl">Cancel</Button>
                                <Button type="submit" isLoading={submitting}
                                    className="rounded-xl bg-[var(--brand)] font-bold text-white">
                                    Continue to payment <ArrowRight size={15}/>
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>

            {/* Universal Share Modal */}
            <Modal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} size="md">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <h3 className="text-xl font-black">Share this Property</h3>
                        <p className="text-xs font-medium text-[var(--muted)]">Spread the word or send to friends, roommates, and family</p>
                    </ModalHeader>
                    <ModalBody>
                        <div className="grid grid-cols-2 gap-3 py-2">
                            <button
                                type="button"
                                onClick={async () => {
                                    await navigator.clipboard.writeText(window.location.href);
                                    toast.success("Link copied to clipboard!");
                                    setIsShareOpen(false);
                                }}
                                className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-3.5 text-left font-bold text-sm transition-all hover:scale-102 hover:shadow-md"
                            >
                                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                                    <Copy size={18} />
                                </div>
                                <span>Copy Link</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${property?.title || "Property"} - ${window.location.href}`)}`, "_blank");
                                    setIsShareOpen(false);
                                }}
                                className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-3.5 text-left font-bold text-sm transition-all hover:scale-102 hover:shadow-md"
                            >
                                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                    <Share2 size={18} />
                                </div>
                                <span>WhatsApp</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
                                    setIsShareOpen(false);
                                }}
                                className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-3.5 text-left font-bold text-sm transition-all hover:scale-102 hover:shadow-md"
                            >
                                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                    <Globe size={18} />
                                </div>
                                <span>Facebook</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(property?.title || "Property")}&url=${encodeURIComponent(window.location.href)}`, "_blank");
                                    setIsShareOpen(false);
                                }}
                                className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-3.5 text-left font-bold text-sm transition-all hover:scale-102 hover:shadow-md"
                            >
                                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                                </div>
                                 <span>X</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank");
                                    setIsShareOpen(false);
                                }}
                                className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-3.5 text-left font-bold text-sm transition-all hover:scale-102 hover:shadow-md"
                            >
                                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                                    <Globe size={18} />
                                </div>
                                <span>LinkedIn</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    window.open(`mailto:?subject=${encodeURIComponent(property?.title || "Property Listing")}&body=${encodeURIComponent(`Check out this property on Nestora: ${property?.title || ""}\n\n${window.location.href}`)}`, "_self");
                                    setIsShareOpen(false);
                                }}
                                className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-3.5 text-left font-bold text-sm transition-all hover:scale-102 hover:shadow-md"
                            >
                                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                    <Mail size={18} />
                                </div>
                                <span>Email</span>
                            </button>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={() => setIsShareOpen(false)} className="rounded-xl font-bold">Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
            {isGalleryOpen && (
                <div className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 p-4 sm:p-6 backdrop-blur-xl animate-in fade-in duration-200">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2 text-sm font-bold">
                            <Images size={18} className="text-[var(--brand)]" />
                            <span>
                                Image {galleryIndex + 1} of {images.length}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsGalleryOpen(false)}
                            className="grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Center Image Container */}
                    <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
                        {images.length > 1 && (
                            <button
                                onClick={prevImage}
                                className="absolute left-2 sm:left-6 z-10 grid size-12 place-items-center rounded-full bg-black/60 text-white shadow-2xl hover:bg-black hover:scale-110 transition-all"
                                aria-label="Previous photo"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}

                        <div className="relative size-full max-w-5xl max-h-[75vh]">
                            <Image
                                src={images[galleryIndex]}
                                fill
                                sizes="100vw"
                                className="object-contain select-none"
                                alt={`Property photo ${galleryIndex + 1}`}
                                priority
                            />
                        </div>

                        {images.length > 1 && (
                            <button
                                onClick={nextImage}
                                className="absolute right-2 sm:right-6 z-10 grid size-12 place-items-center rounded-full bg-black/60 text-white shadow-2xl hover:bg-black hover:scale-110 transition-all"
                                aria-label="Next photo"
                            >
                                <ChevronRight size={24} />
                            </button>
                        )}
                    </div>

                    {/* Bottom Lightbox Thumbnail Carousel */}
                    <div className="flex gap-2.5 overflow-x-auto justify-center py-2 max-w-4xl mx-auto">
                        {images.map((img, i) => (
                            <button
                                key={`lightbox-${img}-${i}`}
                                onClick={() => setGalleryIndex(i)}
                                className={`relative shrink-0 size-16 overflow-hidden rounded-xl border-2 transition-all ${
                                    i === galleryIndex ? "border-[var(--brand)] scale-105 opacity-100" : "border-transparent opacity-50 hover:opacity-80"
                                }`}
                            >
                                <Image src={img} fill className="object-cover" alt={`lightbox thumbnail ${i + 1}`} sizes="64px" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
