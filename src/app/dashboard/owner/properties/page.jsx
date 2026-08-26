"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { api, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/LoadingState";
export default function OwnerPropertiesPage() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [removing, setRemoving] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const load = () => {
        setLoading(true);
        api.get("/properties/mine", { params: { page, limit: 10 } })
            .then(({ data }) => setResult({ data: data.data || [], pagination: data.pagination }))
            .catch(() => setResult({ data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } }))
            .finally(() => setLoading(false));
    };
    useEffect(() => { load(); }, [page]);
    const remove = async () => { if (!removing)
        return; try {
        await api.delete(`/properties/${removing._id}`);
        setResult((old) => old ? { ...old, data: old.data.filter((item) => item._id !== removing._id) } : old);
        toast.success("Property deleted");
        setRemoving(null);
    }
    catch (error) {
        toast.error(getApiErrorMessage(error));
    } };
    if (loading && !result)
        return <LoadingState label="Loading your properties…"/>;
    const pg = result.pagination;
    return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Owner dashboard</span><h1 className="mt-2 text-3xl font-black tracking-[-.04em]">My properties</h1><p className="mt-2 text-sm text-[var(--muted)]">Review listing status and keep your property information up to date.</p></div><Link href="/dashboard/owner/properties/add"><Button className="bg-[var(--brand)] font-bold text-white">Add property</Button></Link></div><div className="mt-7 min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-3xl border border-[var(--line)] bg-[var(--surface)]"><table className="dashboard-table w-full min-w-[780px] lg:min-w-0 text-left text-sm"><thead className="border-b border-[var(--line)] bg-emerald-50/60 text-xs uppercase tracking-wide text-[var(--muted)] dark:bg-emerald-950/50"><tr><th className="p-4">Property</th><th className="p-4">Location</th><th className="p-4">Rent</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{result.data.map((item) => <tr key={item._id} className="border-b border-[var(--line)] last:border-0"><td className="p-4 font-black">{item.title}</td><td className="p-4">{item.location}</td><td className="p-4 font-bold">${item.rent.toLocaleString()}</td><td className="p-4"><div className="flex items-center gap-2"><Chip size="sm" color={item.status === "approved" ? "success" : item.status === "rejected" ? "danger" : "warning"} className="capitalize">{item.status}</Chip>{item.status === "rejected" ? <Button isIconOnly size="sm" variant="light" aria-label="View rejection feedback" onPress={() => setFeedback(item)}><Eye size={16}/></Button> : null}</div></td><td className="p-4"><div className="flex gap-1"><Link href={`/dashboard/owner/properties/${item._id}/edit`}><Button isIconOnly size="sm" variant="flat" aria-label="Update property"><Pencil size={16}/></Button></Link><Button isIconOnly size="sm" color="danger" variant="flat" aria-label="Delete property" onPress={() => setRemoving(item)}><Trash2 size={16}/></Button></div></td></tr>)}{!result.data.length && <tr><td colSpan={5} className="p-10 text-center text-[var(--muted)]">No properties yet. Add your first rental listing.</td></tr>}</tbody></table></div><div className="mt-5 flex justify-center gap-3"><Button variant="flat" isDisabled={pg.page <= 1} onPress={() => setPage((old) => old - 1)}>Previous</Button><span className="py-2 text-sm font-bold">Page {pg.page} of {pg.pages}</span><Button variant="flat" isDisabled={pg.page >= pg.pages} onPress={() => setPage((old) => old + 1)}>Next</Button></div><Modal isOpen={!!feedback} onOpenChange={(open) => !open && setFeedback(null)}><ModalContent>{(onClose) => <><ModalHeader>Rejection feedback</ModalHeader><ModalBody><p className="text-sm leading-6 text-[var(--muted)]">{feedback?.rejectionFeedback || "No feedback provided."}</p></ModalBody><ModalFooter><Button onPress={onClose}>Close</Button></ModalFooter></>}</ModalContent></Modal><Modal isOpen={!!removing} onOpenChange={(open) => !open && setRemoving(null)}><ModalContent>{(onClose) => <><ModalHeader>Delete property?</ModalHeader><ModalBody><p className="text-sm text-[var(--muted)]">This permanently removes <strong>{removing?.title}</strong> and its saved records.</p></ModalBody><ModalFooter><Button variant="light" onPress={onClose}>Cancel</Button><Button color="danger" onPress={remove}>Delete</Button></ModalFooter></>}</ModalContent></Modal></div>;
}
