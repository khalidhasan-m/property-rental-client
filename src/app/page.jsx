"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { ArrowRight, Building2, HeartHandshake, MapPinned, Search, ShieldCheck, Star, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { PropertyCard } from "@/components/PropertyCard";
import { LoadingState } from "@/components/LoadingState";
const benefits = [
    { icon: ShieldCheck, title: "Trusted listings", text: "Every property is moderated before it is available to tenants." },
    { icon: HeartHandshake, title: "Clear booking flow", text: "Send a booking request and manage each step from one secure dashboard." },
    { icon: Building2, title: "Built for both sides", text: "Owners manage listings while tenants save, compare, and book with confidence." },
];
export default function Home() {
    const router = useRouter();
    const [featured, setFeatured] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [location, setLocation] = useState("");
    const [propertyType, setPropertyType] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    useEffect(() => {
        api.get("/properties/featured").then(({ data }) => setFeatured(data.data || [])).catch(() => setFeatured([])).finally(() => setIsLoading(false));
        api.get("/reviews/featured").then(({ data }) => setReviews((data.data || []).slice(0, 4))).catch(() => setReviews([])).finally(() => setReviewsLoading(false));
    }, []);
    const search = () => {
        const params = new URLSearchParams();
        if (location)
            params.set("location", location);
        if (propertyType !== "all")
            params.set("propertyType", propertyType);
        if (minPrice)
            params.set("minPrice", minPrice);
        if (maxPrice)
            params.set("maxPrice", maxPrice);
        router.push(`/properties?${params.toString()}`);
    };
    return (<div className="overflow-hidden">
      <section className="bg-[radial-gradient(circle_at_30%_25%,rgba(237,185,104,0.9),transparent_28%),radial-gradient(circle_at_73%_38%,rgba(95,188,151,0.9),transparent_31%),linear-gradient(135deg,#0e4435_0%,#176b52_48%,#24563f_100%)] relative isolate overflow-hidden py-18 text-white sm:py-24">
        <Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=85" alt="Warm, modern rental home interior" fill priority sizes="100vw" className="-z-20 object-cover"/>
        <div className="absolute inset-0 -z-10 bg-emerald-950/70"/>
        <div className="pointer-events-none absolute -right-28 top-10 size-96 rounded-full border border-white/15"/><div className="pointer-events-none absolute -left-28 bottom-[-14rem] size-96 rounded-full bg-amber-300/15 blur-3xl"/>
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 relative grid items-center gap-12 lg:grid-cols-[1.08fr_.92fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, ease: [0.23, 1, .32, 1] }}>
            <span className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[.14em] text-amber-200">Rental made intentional</span>
            <h1 className="max-w-3xl text-5xl font-black leading-[.98] tracking-[-.05em] sm:text-6xl lg:text-7xl">Find your next place, <em className="font-serif font-medium text-amber-200">without the noise.</em></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-emerald-50/80 sm:text-lg">Discover well-presented rentals, make a secure booking request, and keep every important detail in one calm, clear space.</p>
            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-emerald-50/90"><span className="inline-flex items-center gap-2"><ShieldCheck size={18} className="text-amber-200"/>Moderated listings</span><span className="inline-flex items-center gap-2"><UsersRound size={18} className="text-amber-200"/>Owner & tenant dashboards</span></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .55, delay: .12, ease: [0.23, 1, .32, 1] }} className="rounded-[2rem] border border-white/20 bg-white p-5 text-slate-900 shadow-2xl shadow-emerald-950/25 sm:p-6">
            <p className="mb-5 text-sm font-extrabold uppercase tracking-[.12em] text-emerald-700">Start your search</p>
            <div className="grid gap-3">
              <Input label="Location" placeholder="e.g., Mirpur, Dhaka" value={location} onValueChange={setLocation} startContent={<MapPinned size={18} className="text-emerald-700"/>}/>
              <Select label="Property type" selectedKeys={[propertyType]} onSelectionChange={(keys) => setPropertyType(Array.from(keys)[0] || "all")}>
                <SelectItem key="all">All types</SelectItem><SelectItem key="Apartment">Apartment</SelectItem><SelectItem key="House">House</SelectItem><SelectItem key="Studio">Studio</SelectItem><SelectItem key="Room">Room</SelectItem>
              </Select>
              <div className="grid grid-cols-2 gap-3"><Input label="Min price" type="number" placeholder="0" value={minPrice} onValueChange={setMinPrice}/><Input label="Max price" type="number" placeholder="Any" value={maxPrice} onValueChange={setMaxPrice}/></div>
              <Button onPress={search} className="mt-2 h-12 bg-emerald-950 font-black text-white"><Search size={18}/> Search properties</Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 py-18 sm:py-24">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5"><div><span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Curated for you</span><h2 className="mt-3 text-3xl font-black tracking-[-.04em] sm:text-4xl">Featured spaces</h2><p className="mt-2 max-w-lg text-[var(--muted)]">Freshly approved places with the detail and context you need to make a confident choice.</p></div><Link href="/properties" className="inline-flex items-center gap-2 text-sm font-black text-[var(--brand)] hover:gap-3">Browse every property <ArrowRight size={17}/></Link></div>
        {isLoading ? <LoadingState label="Loading featured properties…"/> : featured.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{featured.map((property, index) => <PropertyCard key={property._id} property={property} index={index}/>)}</div> : <div className="rounded-3xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-10 text-center"><p className="font-bold">Featured properties will appear here once they are approved.</p><Link className="mt-3 inline-block text-sm font-bold text-[var(--brand)]" href="/register">Become an owner to add the first listing</Link></div>}
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--surface)] py-18 sm:py-24"><div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8"><div className="max-w-2xl"><span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Why Nestora</span><h2 className="mt-3 text-3xl font-black tracking-[-.04em] sm:text-4xl">The renting experience, thoughtfully reworked.</h2></div><div className="mt-10 grid gap-5 md:grid-cols-3">{benefits.map((item, index) => <motion.div key={item.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} className="rounded-3xl border border-[var(--line)] bg-[var(--background)] p-6"><div className="grid size-11 place-items-center rounded-2xl bg-emerald-100 text-[var(--brand)]"><item.icon size={22}/></div><h3 className="mt-5 text-lg font-black">{item.title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.text}</p></motion.div>)}</div></div></section>

      <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 grid gap-8 py-18 sm:py-24 lg:grid-cols-[.9fr_1.1fr]"><div><span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Made for your map</span><h2 className="mt-3 text-3xl font-black tracking-[-.04em] sm:text-4xl">Explore a city by the feeling you want to wake up to.</h2><p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">Whether you want a connected apartment, a peaceful house, or a compact studio, a well-filtered search helps you get there faster.</p><Link href="/properties" className="mt-7 inline-flex rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-bold text-white">Explore locations</Link></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-3"><div className="col-span-2 rounded-3xl bg-[var(--brand)] p-7 text-white"><MapPinned className="mb-9 text-amber-200" size={28}/><p className="text-4xl font-black">One search.</p><p className="mt-1 text-emerald-100">More clarity about where you belong.</p></div><div className="rounded-3xl bg-amber-200 p-6 text-emerald-950"><Building2 size={25}/><p className="mt-10 text-sm font-black">Apartments</p></div><div className="rounded-3xl bg-emerald-100 p-6 text-emerald-950"><HeartHandshake size={25}/><p className="mt-10 text-sm font-black">Homes</p></div><div className="rounded-3xl bg-emerald-950 p-6 text-white"><Star size={25} className="text-amber-200"/><p className="mt-10 text-sm font-black">Studios</p></div></div></section>

      <section className="bg-emerald-950 py-18 text-white sm:py-24"><div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8"><div className="max-w-2xl"><span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-amber-200">Tenant stories</span><h2 className="mt-3 text-3xl font-black tracking-[-.04em] sm:text-4xl">A platform designed to make every step feel less uncertain.</h2><p className="mt-3 max-w-xl leading-7 text-emerald-100/75">Real experiences from tenants who used Nestora to find, book, and manage their next place.</p></div>{reviewsLoading ? <LoadingState label="Loading tenant reviews…"/> : reviews.length ? <div className="mt-10 grid gap-5 md:grid-cols-2">{reviews.map((review, index) => <motion.blockquote key={review._id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }} className="rounded-3xl border border-white/15 bg-white/10 p-6"><div className="mb-4 flex items-center justify-between gap-3"><div className="flex text-amber-200">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"}/>)}</div><span className="text-xs font-bold text-emerald-200">{review.propertyTitle}</span></div><p className="text-base font-medium leading-7 text-emerald-50">“{review.comment}”</p><footer className="mt-5 text-sm font-bold text-emerald-200">{review.user?.name || "Nestora tenant"}</footer></motion.blockquote>)}</div> : <div className="mt-8 rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-emerald-100/80">Tenant reviews will appear here after completed bookings.</div>}</div></section>
    </div>);
}
