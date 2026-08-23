"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { HeartOff } from "lucide-react";
import toast from "react-hot-toast";
import { api, getApiErrorMessage } from "@/lib/api";
import { PropertyCard } from "@/components/PropertyCard";
import { LoadingState } from "@/components/LoadingState";
export default function FavoritesPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [removing, setRemoving] = useState(false);
    useEffect(() => { api.get("/favorites").then(({ data }) => setItems(data.data || [])).catch(() => setItems([])).finally(() => setLoading(false)); }, []);
    const remove = async () => { if (!selected)
        return; setRemoving(true); try {
        await api.delete(`/favorites/${selected._id}`);
        setItems((old) => old.filter((item) => item._id !== selected._id));
        toast.success("Favorite removed");
        setSelected(null);
    }
    catch (error) {
        toast.error(getApiErrorMessage(error));
    }
    finally {
        setRemoving(false);
    } };
    if (loading)
        return <LoadingState label="Loading your favorites…"/>;
    return <div><span className="section-kicker">Tenant dashboard</span><h1 className="mt-2 text-3xl font-black tracking-[-.04em]">Saved properties</h1><p className="mt-2 text-sm text-[var(--muted)]">Keep potential homes close while you decide.</p>{items.length ? <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map((property, index) => <div key={property._id} className="relative"><PropertyCard property={property} index={index}/><Button isIconOnly size="sm" color="danger" aria-label="Remove favorite" className="absolute right-4 top-4 z-10" onPress={() => setSelected(property)}><HeartOff size={16}/></Button></div>)}</div> : <div className="mt-7 rounded-3xl border border-dashed border-[var(--line)] p-10 text-center"><h2 className="font-black">Nothing saved yet</h2><p className="mt-2 text-sm text-[var(--muted)]">Use the heart on a property detail page to save it here.</p><Link className="mt-4 inline-block text-sm font-bold text-[var(--brand)]" href="/properties">Explore properties</Link></div>}<Modal isOpen={!!selected} onOpenChange={(open) => !open && setSelected(null)}><ModalContent>{(onClose) => <><ModalHeader>Remove saved property?</ModalHeader><ModalBody><p className="text-sm text-[var(--muted)]">Remove <strong>{selected?.title}</strong> from your favorites? You can save it again anytime.</p></ModalBody><ModalFooter><Button variant="light" onPress={onClose}>Keep it</Button><Button color="danger" isLoading={removing} onPress={remove}>Remove</Button></ModalFooter></>}</ModalContent></Modal></div>;
}
