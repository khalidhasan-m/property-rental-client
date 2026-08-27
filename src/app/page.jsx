"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { ArrowRight, Building2, HeartHandshake, MapPin, MapPinned, Search, ShieldCheck, Star, UsersRound, Sparkles, TrendingUp, Clock, BadgeCheck } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { api } from "@/lib/api";
import { PropertyCard } from "@/components/PropertyCard";
import { LoadingState } from "@/components/LoadingState";

const benefits = [
    { icon: ShieldCheck, title: "100% Moderated Listings", text: "Every property is thoroughly reviewed by administrators before being listed publicly." },
    { icon: HeartHandshake, title: "Seamless Booking Requests", text: "Submit booking requests and track payment approvals from your personal dashboard." },
    { icon: Building2, title: "Transparent Pricing", text: "No hidden fees. Pay reservation deposits securely through Stripe-powered checkout." },
];

const defaultLocations = [
    { name: "Dhaka", properties: 42, image: "/locations/dhaka.jpg" },
    { name: "Chittagong", properties: 28, image: "/locations/chittagong.jpg" },
    { name: "Sylhet", properties: 15, image: "/locations/sylhet.jpg" },
    { name: "Rajshahi", properties: 11, image: "/locations/rajshahi.jpg" },
];

const rentalStats = [
    { icon: Building2, value: "500+", label: "Listed properties" },
    { icon: ShieldCheck, value: "100%", label: "Verified listings" },
    { icon: Star, value: "4.8★", label: "Avg. tenant rating" },
];


function SectionHeader({ badge, title, subtitle, center = false }) {
    return (
        <div className={center ? "text-center" : ""}>
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">{badge}</span>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-5xl">{title}</h2>
            {subtitle && <p className={`mt-3 text-[var(--muted)] ${center ? "mx-auto max-w-xl" : "max-w-lg"}`}>{subtitle}</p>}
        </div>
    );
}

function FadeInSection({ children, delay = 0, className = "" }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay, ease: [0.23, 1, 0.32, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

const CITY_IMAGES = {
    "dhaka": "/locations/dhaka.jpg",
    "chittagong": "/locations/chittagong.jpg",
    "sylhet": "/locations/sylhet.jpg",
    "rajshahi": "/locations/rajshahi.jpg",
    "khulna": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    "barisal": "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=600&q=80",
    "cox's bazar": "https://images.unsplash.com/photo-1623910271383-6f81fc7603c6?auto=format&fit=crop&w=600&q=80",
    "bangladesh": "https://images.unsplash.com/photo-1604993497451-eed6eb271a9c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "new york": "https://images.unsplash.com/photo-_QdFx92MO2U?auto=format&fit=crop&w=800&q=80"
};

export default function Home() {
    const router = useRouter();
    const [featured, setFeatured] = useState([]);
    const [recent, setRecent] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [owners, setOwners] = useState([]);
    const [topLocations, setTopLocations] = useState(defaultLocations);
    const [isLoading, setIsLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [ownersLoading, setOwnersLoading] = useState(true);
    const [locationsLoading, setLocationsLoading] = useState(true);
    const [location, setLocation] = useState("");
    const [propertyType, setPropertyType] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    useEffect(() => {
        api.get("/properties/featured").then(({ data }) => {
            const all = data.data || [];
            setFeatured(all.slice(0, 6));
            setRecent([...all].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4));
        }).catch(() => setFeatured([])).finally(() => setIsLoading(false));
        api.get("/reviews/featured").then(({ data }) => setReviews((data.data || []).slice(0, 4))).catch(() => setReviews([])).finally(() => setReviewsLoading(false));
        api.get("/owners/trusted").then(({ data }) => setOwners(data.data || [])).catch(() => setOwners([])).finally(() => setOwnersLoading(false));
        api.get("/properties/locations/top").then(({ data }) => {
            if (data?.data?.length) {
                const dynamicLocations = data.data.map((loc, i) => {
                    const normalizedName = String(loc.name).trim().toLowerCase();
                    const knownImage = CITY_IMAGES[normalizedName];
                    return {
                        ...loc,
                        image: knownImage || defaultLocations[i % defaultLocations.length].image
                    };
                });
                setTopLocations(dynamicLocations);
            }
        }).catch(() => { }).finally(() => setLocationsLoading(false));
    }, []);

    const search = () => {
        const params = new URLSearchParams();
        if (location) params.set("location", location);
        if (propertyType !== "all") params.set("propertyType", propertyType);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        router.push(`/properties?${params.toString()}`);
    };

    return (
        <div className="overflow-x-clip">
            {/* ══════════════════ HERO BANNER ══════════════════ */}
            <section className="relative left-1/2 isolate w-screen -translate-x-1/2 overflow-hidden py-20 text-white sm:py-28 lg:py-32">
                <Image
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=90"
                    alt="Luxury architectural rental property"
                    fill priority sizes="100vw"
                    className="-z-20 object-cover object-center"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-950/95 via-emerald-950/80 to-emerald-900/60" />
                <div className="absolute inset-0 -z-10 bg-black/30" />
                <div className="pointer-events-none absolute -right-28 top-10 size-96 rounded-full bg-amber-400/20 blur-3xl" />
                <div className="pointer-events-none absolute -left-28 bottom-[-10rem] size-96 rounded-full bg-emerald-400/20 blur-3xl" />

                <div className="mx-auto w-full max-w-full lg:max-w-[1180px] px-4 sm:px-6 lg:px-8 relative grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-amber-300 backdrop-blur-md"
                        >
                            <Sparkles size={14} className="text-amber-300" />
                            Premium Rental Marketplace
                        </motion.span>

                        <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                            Find your next home{" "}
                            <em className="font-serif italic font-normal text-amber-200">with absolute confidence.</em>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.5 }}
                            className="mt-6 max-w-xl text-base leading-8 text-emerald-100/90 sm:text-lg"
                        >
                            Discover handpicked, moderated rental properties with transparent pricing, instant booking requests, and direct owner management.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.5 }}
                            className="mt-8 flex flex-wrap gap-5 text-sm font-bold text-emerald-100/90"
                        >
                            <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur-md border border-white/10">
                                <ShieldCheck size={18} className="text-amber-300" /> Verified Listings
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur-md border border-white/10">
                                <UsersRound size={18} className="text-amber-300" /> Owner & Tenant Portals
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Search Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.65, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
                        className="w-full rounded-[2.5rem] border border-[var(--line)] bg-[var(--surface)] p-6 text-[var(--foreground)] shadow-2xl shadow-emerald-950/40 backdrop-blur-2xl sm:p-7"
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">Start Your Search</p>
                            <span className="rounded-full bg-[var(--brand)]/10 px-3 py-1 text-xs font-bold text-[var(--brand)]">Instant Filter</span>
                        </div>
                        <div className="grid gap-4">
                            <Input label="Location" labelPlacement="outside" placeholder="e.g., Mirpur, Dhaka" value={location} onValueChange={setLocation} startContent={<MapPinned size={18} className="text-[var(--brand)]" />} />
                            <Select label="Property type" labelPlacement="outside" selectedKeys={[propertyType]} onSelectionChange={(keys) => setPropertyType(Array.from(keys)[0] || "all")}>
                                <SelectItem key="all">All property types</SelectItem>
                                <SelectItem key="Apartment">Apartment</SelectItem>
                                <SelectItem key="House">House</SelectItem>
                                <SelectItem key="Studio">Studio</SelectItem>
                                <SelectItem key="Room">Single Room</SelectItem>
                            </Select>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Input label="Min price ($)" labelPlacement="outside" type="number" placeholder="0" value={minPrice} onValueChange={setMinPrice} />
                                <Input label="Max price ($)" labelPlacement="outside" type="number" placeholder="Any" value={maxPrice} onValueChange={setMaxPrice} />
                            </div>
                            <Button onPress={search} size="lg" className="mt-2 h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-700 font-black text-white shadow-lg shadow-emerald-950/30 hover:shadow-xl transition-all">
                                <Search size={18} /> Search Properties
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════ RENTAL STATISTICS ══════════════════ */}
            <section className="bg-emerald-900 border-b border-emerald-950 py-5">
                <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-4 divide-y divide-emerald-700/50 md:flex-row md:divide-x md:divide-y-0">
                        {rentalStats.map((stat, i) => (
                            <FadeInSection key={stat.label} delay={i * 0.1} className="flex w-full justify-center md:py-0 py-2">
                                <div className="flex items-center gap-3">
                                    <stat.icon size={22} className="text-emerald-400" strokeWidth={2} />
                                    <div className="flex flex-col items-start leading-[1.2]">
                                        <span className="text-[17px] font-black text-white">{stat.value}</span>
                                        <span className="text-[13px] font-medium text-emerald-200/90">{stat.label}</span>
                                    </div>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════ FEATURED PROPERTIES ══════════════════ */}
            <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
                <FadeInSection>
                    <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
                        <SectionHeader badge="Curated Selection" title="Featured spaces" subtitle="Freshly approved places with the detail and context you need to make a confident choice." />
                        <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-black text-[var(--brand)] hover:gap-3 transition-all">
                            Browse every property <ArrowRight size={17} />
                        </Link>
                    </div>
                </FadeInSection>

                {isLoading ? (
                    <LoadingState label="Loading featured properties…" />
                ) : featured.length ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {featured.map((property, index) => (
                            <motion.div
                                key={property._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                            >
                                <PropertyCard property={property} index={index} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-10 text-center">
                        <p className="font-bold">Featured properties will appear here once they are approved.</p>
                        <Link className="mt-3 inline-block text-sm font-bold text-[var(--brand)]" href="/register">
                            Become an owner to add the first listing
                        </Link>
                    </div>
                )}
            </section>

            {/* ══════════════════ TOP LOCATIONS ══════════════════ */}
            <section className="border-y border-[var(--line)] bg-[var(--surface)] py-20 sm:py-24">
                <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
                    <FadeInSection>
                        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
                            <SectionHeader badge="Explore by City" title="Top locations" subtitle="Search rentals in the most popular cities across the country." />
                            <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-black text-[var(--brand)] hover:gap-3 transition-all">
                                View all <ArrowRight size={17} />
                            </Link>
                        </div>
                    </FadeInSection>
                    {locationsLoading ? (
                        <LoadingState label="Loading top locations…" />
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {(() => {
                                const filtered = topLocations.filter(loc => !['or', 'sc'].includes(loc.name.toLowerCase()));
                                const topFour = filtered.slice(0, 4);
                                const needed = 4 - topFour.length;
                                if (needed > 0) {
                                    const extra = defaultLocations
                                        .filter(d => !filtered.some(l => l.name === d.name))
                                        .slice(0, needed);
                                    topFour.push(...extra);
                                }
                                return topFour.map((loc, i) => (
                                    <motion.div
                                        key={loc.name}
                                        initial={{ opacity: 0, scale: 0.92 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1, duration: 0.45 }}
                                        whileHover={{ scale: 1.03 }}
                                    >
                                        <Link href={`/properties?location=${encodeURIComponent(loc.name)}`} className="group relative block overflow-hidden rounded-3xl" style={{ height: 200 }}>
                                            <Image src={loc.image || CITY_IMAGES[loc.name.toLowerCase()] || "/locations/placeholder.jpg"} alt={loc.name} fill sizes="300px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <p className="text-base font-black text-white">{loc.name}</p>
                                                <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                                                    <MapPin size={12} /> {loc.properties || 0} listings
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ));
                            })()}
                        </div>
                    )}
                </div>
            </section>

            {/* ══════════════════ RECENTLY ADDED PROPERTIES ══════════════════ */}
            <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
                <FadeInSection>
                    <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
                        <SectionHeader badge="Fresh Listings" title={<><Clock size={28} className="inline mr-2 text-[var(--brand)]" />Recently Added</>} subtitle="Hot off the press — newly approved listings you won't want to miss." />
                        <Link href="/properties?sort=newest" className="inline-flex items-center gap-2 text-sm font-black text-[var(--brand)] hover:gap-3 transition-all">
                            See all new <ArrowRight size={17} />
                        </Link>
                    </div>
                </FadeInSection>

                {isLoading ? (
                    <LoadingState label="Loading recent properties…" />
                ) : recent.length ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {recent.map((property, index) => (
                            <motion.div
                                key={property._id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.45 }}
                            >
                                <PropertyCard property={property} index={index} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-10 text-center">
                        <p className="text-[var(--muted)]">No properties added recently.</p>
                    </div>
                )}
            </section>

            {/* ══════════════════ CUSTOMER REVIEWS ══════════════════ */}
            <section className="border-y border-[var(--line)] bg-[var(--surface)] py-20 sm:py-24">
                <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
                    <FadeInSection>
                        <div className="mb-12 text-center">
                            <SectionHeader center badge="Real Experiences" title="What tenants say" subtitle="Genuine reviews from people who found their home through Nestora." />
                        </div>
                    </FadeInSection>

                    {reviewsLoading ? (
                        <LoadingState label="Loading reviews…" />
                    ) : reviews.length ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {reviews.map((rev, i) => (
                                <motion.div
                                    key={rev._id}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.12, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                    whileHover={{ y: -4 }}
                                    className="flex flex-col rounded-3xl border border-[var(--line)] bg-[var(--background)] p-6 shadow-xs hover:shadow-lg transition-all"
                                >
                                    <div className="flex gap-0.5 mb-4">
                                        {Array.from({ length: 5 }).map((_, s) => (
                                            <Star key={s} size={14} className={s < (rev.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                                        ))}
                                    </div>
                                    <p className="flex-1 text-sm leading-7 text-[var(--muted)] italic">"{rev.comment}"</p>
                                    <div className="mt-5 flex items-center gap-3 border-t border-[var(--line)] pt-4">
                                        {rev.user?.photoURL ? (
                                            <div className="relative size-9 shrink-0 overflow-hidden rounded-full shadow-sm">
                                                <Image src={rev.user.photoURL} alt={rev.user.name || "Tenant"} fill className="object-cover" sizes="40px" />
                                            </div>
                                        ) : (
                                            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-xs font-black text-white">
                                                {(rev.user?.name || "T")[0].toUpperCase()}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold">{rev.user?.name || "Tenant"}</p>
                                            <p className="text-xs text-[var(--muted)]">{rev.propertyTitle || "Nestora property"}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        /* Fallback static reviews */
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {[
                                { name: "Arif Hossain", rating: 5, comment: "Found my perfect apartment in Dhaka within days. The booking process was incredibly smooth and transparent.", property: "Mirpur 2 Apartment" },
                                { name: "Sadia Rahman", rating: 5, comment: "As a first-time renter, I was nervous but Nestora made everything easy. The listing details were accurate.", property: "Gulshan Studio" },
                                { name: "Minhaj Uddin", rating: 5, comment: "The owner was professional and the property matched perfectly with the photos. Highly recommend!", property: "Uttara House" },
                                { name: "Nusrat Jahan", rating: 4, comment: "Excellent platform. The admin verification system means you can trust every listing you see.", property: "Motijheel Office Flat" },
                            ].map((rev, i) => (
                                <motion.div
                                    key={rev.name}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.12, duration: 0.5 }}
                                    whileHover={{ y: -4 }}
                                    className="flex flex-col rounded-3xl border border-[var(--line)] bg-[var(--background)] p-6 shadow-xs hover:shadow-lg transition-all"
                                >
                                    <div className="flex gap-0.5 mb-4">
                                        {Array.from({ length: 5 }).map((_, s) => (
                                            <Star key={s} size={14} className={s < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                                        ))}
                                    </div>
                                    <p className="flex-1 text-sm leading-7 text-[var(--muted)] italic">"{rev.comment}"</p>
                                    <div className="mt-5 flex items-center gap-3 border-t border-[var(--line)] pt-4">
                                        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-xs font-black text-white">
                                            {rev.name[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold">{rev.name}</p>
                                            <p className="text-xs text-[var(--muted)]">{rev.property}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ══════════════════ TRUSTED OWNERS ══════════════════ */}
            <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
                <FadeInSection>
                    <div className="mb-12 text-center">
                        <SectionHeader center badge="Our Community" title="Trusted property owners" subtitle="Meet some of our top-rated owners who consistently deliver excellent rental experiences." />
                    </div>
                </FadeInSection>
                {ownersLoading ? (
                    <LoadingState label="Loading trusted owners…" />
                ) : owners.length ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {owners.map((owner, i) => (
                            <motion.div
                                key={owner._id}
                                initial={{ opacity: 0, scale: 0.92 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.45 }}
                                whileHover={{ scale: 1.03 }}
                                className="flex flex-col items-center gap-4 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-7 text-center shadow-xs hover:shadow-lg hover:border-[var(--brand)]/30 transition-all"
                            >
                                {owner.photoURL ? (
                                    <div className="relative size-16 overflow-hidden rounded-full shadow-lg shadow-emerald-900/30">
                                        <Image src={owner.photoURL} alt={owner.name} fill className="object-cover" sizes="40px" />
                                    </div>
                                ) : (
                                    <div className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-900 text-xl font-black text-white shadow-lg shadow-emerald-900/30">
                                        {(owner.name || "O")[0].toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="font-black">{owner.name}</p>
                                    <p className="flex items-center justify-center gap-1 text-xs text-[var(--muted)] mt-1">
                                        <MapPin size={11} /> {owner.location || "Bangladesh"}
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-[var(--brand-light)] px-4 py-1.5 text-xs font-bold text-[var(--brand)]">
                                    {owner.propertiesCount || 1} properties
                                </div>
                                <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, s) => (
                                        <Star key={s} size={13} className="fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-10 text-center">
                        <p className="text-[var(--muted)]">Trusted owners will be displayed here.</p>
                    </div>
                )}
            </section>

            {/* ══════════════════ BENEFITS ══════════════════ */}
            <section className="border-t border-[var(--line)] bg-[var(--surface)] py-20 sm:py-24">
                <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
                    <FadeInSection>
                        <div className="max-w-2xl">
                            <SectionHeader badge="Why Nestora" title="The renting experience, thoughtfully reworked." />
                        </div>
                    </FadeInSection>
                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {benefits.map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.12, duration: 0.45 }}
                                whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(5,150,105,0.15)" }}
                                className="rounded-3xl border border-[var(--line)] bg-[var(--background)] p-7 transition-all"
                            >
                                <div className="grid size-12 place-items-center rounded-2xl bg-[var(--brand-light)] text-[var(--brand)] border border-[var(--brand)]/15">
                                    <item.icon size={24} />
                                </div>
                                <h3 className="mt-5 text-xl font-black">{item.title}</h3>
                                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════ CTA BANNER ══════════════════ */}
            <section className="relative overflow-hidden py-20 sm:py-24">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900" />
                <div className="pointer-events-none absolute -right-40 -top-20 size-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -left-40 -bottom-20 size-[500px] rounded-full bg-teal-500/10 blur-3xl" />
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 text-center text-white"
                >
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-amber-300">
                        <Sparkles size={13} /> Get Started Today
                    </span>
                    <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-5xl">
                        Ready to find your perfect rental?
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl text-emerald-200/80">
                        Join thousands of happy tenants who found their home on Nestora — transparent, secure, and stress-free.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link href="/properties">
                            <Button size="lg" className="h-12 rounded-2xl bg-white font-black text-emerald-900 px-8 hover:bg-emerald-50 transition-all shadow-xl">
                                Browse Properties <ArrowRight size={17} />
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button size="lg" variant="bordered" className="h-12 rounded-2xl border-2 border-white/30 font-black text-white px-8 hover:bg-white/10 transition-all">
                                Create Free Account
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
