"use client";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
export function PropertyCard({ property, index = 0 }) {
    const { user } = useAuth();
    const href = user ? `/properties/${property._id}` : "/login";
    const onNavigate = () => { if (!user)
        toast("Please sign in to view property details."); };
    return (<motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.3) }} className="transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(17,36,28,0.12)] motion-reduce:transition-none motion-reduce:hover:transform-none overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-emerald-100">
        <Image src={property.images[0] || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"} alt={property.title} fill className="object-cover transition duration-500 hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw"/>
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold capitalize text-emerald-900 shadow-sm">{property.propertyType}</span>
        {property.averageRating ? <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-950/90 px-3 py-1 text-xs font-bold text-white"><Star size={13} fill="currentColor"/>{property.averageRating}</span> : null}
      </div>
      <div className="p-5">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[var(--muted)]"><MapPin size={14} className="text-[var(--brand)]"/>{property.location}</p>
        <h3 className="line-clamp-1 text-lg font-black tracking-tight">{property.title}</h3>
        <div className="mt-3 flex items-center gap-4 text-sm text-[var(--muted)]"><span className="inline-flex items-center gap-1"><BedDouble size={16}/>{property.bedrooms} beds</span><span className="inline-flex items-center gap-1"><Bath size={16}/>{property.bathrooms} baths</span></div>
        <div className="mt-5 flex items-end justify-between gap-3"><div><span className="text-xl font-black text-[var(--brand)]">${property.rent.toLocaleString()}</span><span className="ml-1 text-xs font-medium text-[var(--muted)]">/{property.rentType.replace("ly", "")}</span></div><Link onClick={onNavigate} href={href} className="rounded-xl bg-emerald-950 px-3 py-2 text-sm font-bold text-white transition hover:bg-[var(--brand)]">View details</Link></div>
      </div>
    </motion.article>);
}
