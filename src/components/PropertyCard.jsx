"use client";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, MapPin, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

const TYPE_COLORS = {
    Apartment: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
    House: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    Studio: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
    Room: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
};

export function PropertyCard({ property, index = 0 }) {
    const { user } = useAuth();
    const href = user ? `/properties/${property._id}` : "/login";
    const typeColor = TYPE_COLORS[property.propertyType] || "bg-emerald-100 text-emerald-800";

    const onNavigate = () => {
        if (!user) toast("Please sign in to view property details.", { icon: "🔒" });
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.35), ease: [0.23, 1, 0.32, 1] }}
            className="group overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lg)] motion-reduce:transition-none motion-reduce:hover:transform-none"
        >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-emerald-50 dark:bg-emerald-950">
                <Image
                    src={property.images?.[0] || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>

                {/* Property type badge */}
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold ${typeColor} shadow-sm`}>
                    {property.propertyType}
                </span>

                {/* Rating badge */}
                {property.averageRating ? (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                        <Star size={11} fill="currentColor" className="text-amber-400"/>
                        {property.averageRating}
                    </span>
                ) : null}

                {/* View details overlay button */}
                <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <Link onClick={onNavigate} href={href}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-emerald-900 shadow-lg hover:bg-emerald-50 transition-colors">
                        View details <ArrowRight size={13}/>
                    </Link>
                </div>
            </div>

            {/* Body */}
            <div className="p-5">
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)]">
                    <MapPin size={13} className="shrink-0 text-[var(--brand)]"/>
                    <span className="truncate">{property.location}</span>
                </p>
                <h3 className="line-clamp-1 text-base font-black tracking-tight">{property.title}</h3>

                <div className="mt-3 flex items-center gap-4 text-xs text-[var(--muted)]">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-2)] px-2.5 py-1.5 font-semibold">
                        <BedDouble size={13} className="text-[var(--brand)]"/>
                        {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-2)] px-2.5 py-1.5 font-semibold">
                        <Bath size={13} className="text-[var(--brand)]"/>
                        {property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}
                    </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
                    <div>
                        <span className="text-xl font-black text-[var(--brand)]">${property.rent?.toLocaleString()}</span>
                        <span className="ml-1 text-xs font-medium text-[var(--muted)]">
                            /{property.rentType?.replace("ly", "") || "mo"}
                        </span>
                    </div>
                    <Link onClick={onNavigate} href={href}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-950 px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-[var(--brand)] hover:gap-2.5 dark:bg-emerald-700">
                        View <ArrowRight size={13}/>
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}
