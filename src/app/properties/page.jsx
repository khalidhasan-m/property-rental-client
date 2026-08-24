"use client";
import Image from "next/image";
import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { PropertyCard } from "@/components/PropertyCard";
import { LoadingState } from "@/components/LoadingState";

const types = ["Apartment", "House", "Studio", "Room"];

function PropertiesContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [draft, setDraft] = useState({
        location: searchParams.get("location") || "",
        propertyType: searchParams.get("propertyType") || "all",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        sort: searchParams.get("sort") || "newest"
    });

    const load = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get("/properties", { params: { limit: 9, ...Object.fromEntries(searchParams.entries()) } });
            setResult({ data: data.data || [], pagination: data.pagination });
        } catch {
            setResult({ data: [], pagination: { page: 1, limit: 9, total: 0, pages: 1 } });
        } finally {
            setIsLoading(false);
        }
    }, [searchParams]);

    useEffect(() => { void load(); }, [load]);

    const updateUrl = (updates) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) =>
            value && value !== "all" ? params.set(key, value) : params.delete(key)
        );
        if (!("page" in updates)) params.delete("page");
        router.replace(`${pathname}${params.size ? `?${params}` : ""}`);
    };

    const apply = () => updateUrl(draft);
    const current = result?.pagination.page || 1;

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* PAGE HERO BANNER */}
            <div className="relative isolate overflow-hidden bg-emerald-950 py-16 text-white sm:py-20">
                <Image
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=85"
                    alt="Modern interior rental property"
                    fill
                    priority
                    sizes="100vw"
                    className="-z-20 object-cover opacity-35"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-950/90 via-emerald-950/75 to-emerald-900/60" />

                <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.14em] text-amber-300 backdrop-blur-md">
                            <Sparkles size={14} /> Approved Listings
                        </span>
                        <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                            All Approved Properties
                        </h1>
                        <p className="mt-4 text-base leading-7 text-emerald-100/90 sm:text-lg">
                            Browse verified rental homes, filter by location or price range, and submit your reservation request with peace of mind.
                        </p>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                {/* FILTER BAR CARD */}
                <section className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
                    <div className="grid gap-4 items-end md:grid-cols-2 lg:grid-cols-[1.2fr_.9fr_.6fr_.6fr_auto]">
                        <Input
                            label="Location"
                            labelPlacement="outside"
                            placeholder="Search a location"
                            value={draft.location}
                            onValueChange={(location) => setDraft({ ...draft, location })}
                            startContent={<Search size={17} />}
                        />
                        
                        <label className="grid gap-1.5 text-xs font-bold text-[var(--muted)]">
                            Property type
                            <select
                                value={draft.propertyType}
                                onChange={(event) => setDraft({ ...draft, propertyType: event.target.value })}
                                className="h-10 rounded-xl border border-[var(--line)] bg-transparent px-3 text-sm font-bold text-[var(--foreground)]"
                            >
                                <option value="all">All types</option>
                                {types.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </label>

                        <Input
                            label="Min price ($)"
                            labelPlacement="outside"
                            placeholder="0"
                            type="number"
                            value={draft.minPrice}
                            onValueChange={(minPrice) => setDraft({ ...draft, minPrice })}
                        />

                        <Input
                            label="Max price ($)"
                            labelPlacement="outside"
                            placeholder="Any"
                            type="number"
                            value={draft.maxPrice}
                            onValueChange={(maxPrice) => setDraft({ ...draft, maxPrice })}
                        />

                        <Button
                            onPress={apply}
                            className="self-end h-10 bg-[var(--brand)] font-bold text-white rounded-xl hover:bg-[var(--brand-deep)] transition-colors"
                        >
                            <SlidersHorizontal size={17} /> Apply
                        </Button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-3">
                        <p className="text-sm font-bold text-[var(--muted)]">
                            {result ? `${result.pagination.total} properties found` : ""}
                        </p>
                        
                        <label className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]">
                            Sort by:
                            <select
                                aria-label="Sort results"
                                value={draft.sort}
                                onChange={(event) => {
                                    const sort = event.target.value;
                                    setDraft({ ...draft, sort });
                                    updateUrl({ sort });
                                }}
                                className="h-9 rounded-xl border border-[var(--line)] bg-transparent px-3 text-sm font-bold text-[var(--foreground)]"
                            >
                                <option value="newest">Newest first</option>
                                <option value="price_asc">Price: low to high</option>
                                <option value="price_desc">Price: high to low</option>
                            </select>
                        </label>
                    </div>
                </section>

                {/* RESULTS GRID */}
                {isLoading ? (
                    <LoadingState label="Finding the right places…" />
                ) : result && result.data.length ? (
                    <>
                        <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {result.data.map((property, index) => (
                                <PropertyCard key={property._id} property={property} index={index} />
                            ))}
                        </div>

                        <div className="mt-10 flex items-center justify-center gap-3">
                            <Button variant="flat" isDisabled={current <= 1} onPress={() => updateUrl({ page: String(current - 1) })}>
                                Previous
                            </Button>
                            <span className="text-sm font-bold">Page {current} of {result.pagination.pages}</span>
                            <Button variant="flat" isDisabled={current >= result.pagination.pages} onPress={() => updateUrl({ page: String(current + 1) })}>
                                Next
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="mt-9 rounded-3xl border border-dashed border-[var(--line)] p-12 text-center bg-[var(--surface)]">
                        <h2 className="font-black text-xl">No properties match those filters.</h2>
                        <p className="mt-2 text-sm text-[var(--muted)]">Try widening your search location or clearing a price range.</p>
                        <Button
                            variant="flat"
                            className="mt-5 rounded-xl font-bold"
                            onPress={() => {
                                setDraft({ location: "", propertyType: "all", minPrice: "", maxPrice: "", sort: "newest" });
                                router.replace(pathname);
                            }}
                        >
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default function PropertiesPage() {
    return (
        <Suspense fallback={<LoadingState label="Preparing property filters…" />}>
            <PropertiesContent />
        </Suspense>
    );
}
