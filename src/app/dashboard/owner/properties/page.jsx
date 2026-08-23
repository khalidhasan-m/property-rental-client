"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { api, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/LoadingState";
export default function OwnerPropertiesPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const load = () => api.get("/properties/mine", { params: { limit: 50 } }).then(({ data }) => setItems(data.data || [])).catch(() => setItems([])).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);
    const remove = async () => { if (!removing)
        return; try {
        await api.delete(`/properties/${removing._id}`);
        setItems((old) => old.filter((item) => item._id !== removing._id));
        toast.success("Property deleted");
        setRemoving(null);
    }
    catch (error) {
        toast.error(getApiErrorMessage(error));
    } };
    if (loading)
        return <LoadingState label="Loading your properties…"/>;
    return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><span className="section-kicker">Owner dashboard</span><h1 className="mt-2 text-3xl font-black tracking-[-.04em]">My properties</h1><p className="mt-2 text-sm text-[var(--muted)]">Review listing status and keep your property information up to date.</p></div><Link href="/dashboard/owner/properties/add"><Button className="bg-[var(--brand)] font-bold text-white">Add property</Button></Link></div><div className="mt-7 overflow-x-auto rounded-3xl border border-[var(--line)] bg-[var(--surface)]"><table className="w-full min-w-[780px] text-left text-sm"><thead className="border-b border-[var(--line)] bg-emerald-50/60 text-xs uppercase tracking-wide text-[var(--muted)] dark:bg-emerald-950/50"><tr><th className="p-4">Property</th><th className="p-4">Location</th><th className="p-4">Rent</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{items.map((item) => <tr key={item._id} className="border-b border-[var(--line)] last:border-0"><td className="p-4 font-black">{item.title}</td><td className="p-4">{item.location}</td><td className="p-4 font-bold">${item.rent.toLocaleString()}</td><td className="p-4"><div className="flex items-center gap-2"><Chip size="sm" color={item.status === "approved" ? "success" : item.status === "rejected" ? "danger" : "warning"} className="capitalize">{item.status}</Chip>{item.status === "rejected" && item.rejectionFeedback ? <Button isIconOnly size="sm" variant="light" aria-label="View rejection feedback" onPress={() => setFeedback(item)}><Eye size={16}/></Button> : null}</div></td><td className="p-4"><div className="flex gap-1"><Link href={`/dashboard/owner/properties/${item._id}/edit`}><Button isIconOnly size="sm" variant="flat" aria-label="Update property"><Pencil size={16}/></Button></Link><Button isIconOnly size="sm" color="danger" variant="flat" aria-label="Delete property" onPress={() => setRemoving(item)}><Trash2 size={16}/></Button></div></td></tr>)}{!items.length && <tr><td colSpan={5} className="p-10 text-center text-[var(--muted)]">No properties yet. Add your first rental listing.</td></tr>}</tbody></table></div><Modal isOpen={!!feedback} onOpenChange={(open) => !open && setFeedback(null)}><ModalContent>{(onClose) => <><ModalHeader>Rejection feedback</ModalHeader><ModalBody><p className="text-sm leading-6 text-[var(--muted)]">{feedback?.rejectionFeedback}</p></ModalBody><ModalFooter><Button onPress={onClose}>Close</Button></ModalFooter></>}</ModalContent></Modal><Modal isOpen={!!removing} onOpenChange={(open) => !open && setRemoving(null)}><ModalContent>{(onClose) => <><ModalHeader>Delete property?</ModalHeader><ModalBody><p className="text-sm text-[var(--muted)]">This permanently removes <strong>{removing?.title}</strong> and its saved records.</p></ModalBody><ModalFooter><Button variant="light" onPress={onClose}>Cancel</Button><Button color="danger" onPress={remove}>Delete</Button></ModalFooter></>}</ModalContent></Modal></div>;
}
