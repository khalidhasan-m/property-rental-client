"use client";
import { useEffect, useState } from "react";
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@heroui/react";
import { Check, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { api, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/LoadingState";
export default function AdminPropertiesPage() {
    const [result, setResult] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [moderating, setModerating] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [deleting, setDeleting] = useState(null);
    const [saving, setSaving] = useState(false);
    const load = () => { setLoading(true); api.get("/properties/admin/all", { params: { page, limit: 10 } }).then(({ data }) => setResult({ data: data.data, pagination: data.pagination })).catch(() => setResult({ data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } })).finally(() => setLoading(false)); };
    useEffect(() => { load(); }, [page]);
    const moderate = async () => { if (!moderating)
        return; if (moderating.status === "rejected" && feedback.trim().length < 5)
        return toast.error("Provide at least 5 characters of feedback"); setSaving(true); try {
        await api.patch(`/properties/admin/${moderating.property._id}/moderate`, { status: moderating.status, rejectionFeedback: moderating.status === "rejected" ? feedback : undefined });
        setResult((old) => old ? { ...old, data: old.data.map((item) => item._id === moderating.property._id ? { ...item, status: moderating.status, rejectionFeedback: feedback } : item) } : old);
        toast.success(`Property ${moderating.status}`);
        setModerating(null);
        setFeedback("");
    }
    catch (error) {
        toast.error(getApiErrorMessage(error));
    }
    finally {
        setSaving(false);
    } };
    const remove = async () => { if (!deleting)
        return; setSaving(true); try {
        await api.delete(`/properties/${deleting._id}`);
        setResult((old) => old ? { ...old, data: old.data.filter((item) => item._id !== deleting._id) } : old);
        toast.success("Property deleted");
        setDeleting(null);
    }
    catch (error) {
        toast.error(getApiErrorMessage(error));
    }
    finally {
        setSaving(false);
    } };
    if (loading && !result)
        return <LoadingState label="Loading all properties…"/>;
    const pg = result.pagination;
    return <div><span className="section-kicker">Admin dashboard</span><h1 className="mt-2 text-3xl font-black tracking-[-.04em]">All properties</h1><p className="mt-2 text-sm text-[var(--muted)]">Moderate submissions and keep marketplace listings accurate.</p><div className="mt-7 overflow-x-auto rounded-3xl border border-[var(--line)] bg-[var(--surface)]"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b border-[var(--line)] bg-emerald-50/60 text-xs uppercase tracking-wide text-[var(--muted)] dark:bg-emerald-950/50"><tr><th className="p-4">Property</th><th className="p-4">Owner</th><th className="p-4">Rent</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{result.data.map((property) => <tr key={property._id} className="border-b border-[var(--line)] last:border-0"><td className="p-4"><p className="font-black">{property.title}</p><p className="text-xs text-[var(--muted)]">{property.location}</p></td><td className="p-4"><p className="font-bold">{property.owner.name}</p><p className="text-xs text-[var(--muted)]">{property.owner.email}</p></td><td className="p-4 font-bold">${property.rent.toLocaleString()}</td><td className="p-4"><Chip size="sm" color={property.status === "approved" ? "success" : property.status === "rejected" ? "danger" : "warning"} className="capitalize">{property.status}</Chip></td><td className="p-4"><div className="flex gap-1">{property.status !== "approved" && <Button isIconOnly size="sm" color="success" variant="flat" aria-label="Approve" onPress={() => setModerating({ property, status: "approved" })}><Check size={16}/></Button>}{property.status !== "rejected" && <Button isIconOnly size="sm" color="danger" variant="flat" aria-label="Reject" onPress={() => setModerating({ property, status: "rejected" })}><X size={16}/></Button>}<Button isIconOnly size="sm" color="danger" variant="light" aria-label="Delete" onPress={() => setDeleting(property)}><Trash2 size={16}/></Button></div></td></tr>)}{!result.data.length && <tr><td colSpan={5} className="p-10 text-center text-[var(--muted)]">No properties found.</td></tr>}</tbody></table></div><div className="mt-5 flex justify-center gap-3"><Button variant="flat" isDisabled={pg.page <= 1} onPress={() => setPage((old) => old - 1)}>Previous</Button><span className="py-2 text-sm font-bold">Page {pg.page} of {pg.pages}</span><Button variant="flat" isDisabled={pg.page >= pg.pages} onPress={() => setPage((old) => old + 1)}>Next</Button></div><Modal isOpen={!!moderating} onOpenChange={(open) => !open && setModerating(null)}><ModalContent>{(onClose) => <><ModalHeader>{moderating?.status === "approved" ? "Approve property?" : "Reject property?"}</ModalHeader><ModalBody>{moderating?.status === "rejected" ? <Textarea label="Rejection feedback" placeholder="Explain what the owner should update before resubmission" value={feedback} onValueChange={setFeedback} isRequired/> : <p className="text-sm text-[var(--muted)]">This property will become publicly searchable for tenants.</p>}</ModalBody><ModalFooter><Button variant="light" onPress={onClose}>Cancel</Button><Button color={moderating?.status === "approved" ? "success" : "danger"} isLoading={saving} onPress={moderate}>Confirm</Button></ModalFooter></>}</ModalContent></Modal><Modal isOpen={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}><ModalContent>{(onClose) => <><ModalHeader>Delete property?</ModalHeader><ModalBody><p className="text-sm text-[var(--muted)]">This deletes <strong>{deleting?.title}</strong> from the marketplace.</p></ModalBody><ModalFooter><Button variant="light" onPress={onClose}>Cancel</Button><Button color="danger" isLoading={saving} onPress={remove}>Delete</Button></ModalFooter></>}</ModalContent></Modal></div>;
}
