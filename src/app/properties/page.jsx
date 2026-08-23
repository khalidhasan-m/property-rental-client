"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { Search, SlidersHorizontal } from "lucide-react";
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
    const [draft, setDraft] = useState({ location: searchParams.get("location") || "", propertyType: searchParams.get("propertyType") || "all", minPrice: searchParams.get("minPrice") || "", maxPrice: searchParams.get("maxPrice") || "", sort: searchParams.get("sort") || "newest" });
    const load = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get("/properties", { params: Object.fromEntries(searchParams.entries()) });
            setResult({ data: data.data || [], pagination: data.pagination });
        }
        catch {
            setResult({ data: [], pagination: { page: 1, limit: 9, total: 0, pages: 1 } });
        }
        finally {
            setIsLoading(false);
        }
    }, [searchParams]);
    useEffect(() => { void load(); }, [load]);
    const updateUrl = (updates) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => value && value !== "all" ? params.set(key, value) : params.delete(key));
        if (!("page" in updates))
            params.delete("page");
        router.replace(`${pathname}${params.size ? `?${params}` : ""}`);
    };
    const apply = () => updateUrl(draft);
    const current = result?.pagination.page || 1;
    return <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 py-12 sm:py-16"><div className="max-w-2xl"><span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Find your fit</span><h1 className="mt-3 text-4xl font-black tracking-[-.05em] sm:text-5xl">All approved properties</h1><p className="mt-3 leading-7 text-[var(--muted)]">Use location, property type, and price to narrow down the places that make the most sense for you.</p></div>
    <section className="mt-9 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm sm:p-5"><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1.2fr_.9fr_.6fr_.6fr_auto]"><Input label="Location" placeholder="Search a location" value={draft.location} onValueChange={(location) => setDraft({ ...draft, location })} startContent={<Search size={17}/>}/><label className="grid gap-1 text-xs font-bold text-[var(--muted)]">Property type<select value={draft.propertyType} onChange={(event) => setDraft({ ...draft, propertyType: event.target.value })} className="h-10 rounded-xl border border-[var(--line)] bg-transparent px-3 text-sm font-bold text-[var(--foreground)]"><option value="all">All types</option>{types.map((type) => <option key={type} value={type}>{type}</option>)}</select></label><Input label="Min price" type="number" value={draft.minPrice} onValueChange={(minPrice) => setDraft({ ...draft, minPrice })}/><Input label="Max price" type="number" value={draft.maxPrice} onValueChange={(maxPrice) => setDraft({ ...draft, maxPrice })}/><Button onPress={apply} className="self-end bg-[var(--brand)] font-bold text-white"><SlidersHorizontal size={17}/>Apply</Button></div><div className="mt-3 flex flex-wrap justify-between gap-3"><p className="text-sm text-[var(--muted)]">{result ? `${result.pagination.total} properties found` : ""}</p><label className="grid gap-1 text-xs font-bold text-[var(--muted)]">Sort<select aria-label="Sort results" value={draft.sort} onChange={(event) => { const sort = event.target.value; setDraft({ ...draft, sort }); updateUrl({ sort }); }} className="h-9 w-48 rounded-xl border border-[var(--line)] bg-transparent px-3 text-sm font-bold text-[var(--foreground)]"><option value="newest">Newest first</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></label></div></section>
    {isLoading ? <LoadingState label="Finding the right places…"/> : result && result.data.length ? <><div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{result.data.map((property, index) => <PropertyCard key={property._id} property={property} index={index}/>)}</div><div className="mt-10 flex items-center justify-center gap-3"><Button variant="flat" isDisabled={current <= 1} onPress={() => updateUrl({ page: String(current - 1) })}>Previous</Button><span className="text-sm font-bold">Page {current} of {result.pagination.pages}</span><Button variant="flat" isDisabled={current >= result.pagination.pages} onPress={() => updateUrl({ page: String(current + 1) })}>Next</Button></div></> : <div className="mt-9 rounded-3xl border border-dashed border-[var(--line)] p-12 text-center"><h2 className="font-black">No properties match those filters.</h2><p className="mt-2 text-sm text-[var(--muted)]">Try widening your search or clearing a price range.</p><Button variant="flat" className="mt-4" onPress={() => { setDraft({ location: "", propertyType: "all", minPrice: "", maxPrice: "", sort: "newest" }); router.replace(pathname); }}>Clear filters</Button></div>}
  </div>;
}
export default function PropertiesPage() {
    return <Suspense fallback={<LoadingState label="Preparing property filters…"/>}><PropertiesContent /></Suspense>;
}
