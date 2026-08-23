"use client";
import { useEffect, useState } from "react";
import { Button, Chip, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@heroui/react";
import { Check, Edit3, Trash2, X } from "lucide-react";
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
    const [editing, setEditing] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", description: "", location: "", rent: "", bedrooms: "", bathrooms: "", propertySize: "", amenities: "", extraFeatures: "" });
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
    const beginEdit = (property) => { setEditing(property); setEditForm({ title: property.title || "", description: property.description || "", location: property.location || "", rent: String(property.rent ?? ""), bedrooms: String(property.bedrooms ?? ""), bathrooms: String(property.bathrooms ?? ""), propertySize: String(property.propertySize ?? ""), amenities: (property.amenities || []).join(", "), extraFeatures: (property.extraFeatures || []).join(", ") }); };
    const saveEdit = async () => { if (!editing)
        return; setSaving(true); try {
        const payload = { title: editForm.title.trim(), description: editForm.description.trim(), location: editForm.location.trim(), rent: Number(editForm.rent), bedrooms: Number(editForm.bedrooms), bathrooms: Number(editForm.bathrooms), propertySize: Number(editForm.propertySize), amenities: editForm.amenities.split(",").map((item) => item.trim()).filter(Boolean), extraFeatures: editForm.extraFeatures.split(",").map((item) => item.trim()).filter(Boolean), propertyType: editing.propertyType, rentType: editing.rentType, images: editing.images };
        const { data } = await api.patch(`/properties/${editing._id}`, payload);
        setResult((old) => old ? { ...old, data: old.data.map((item) => item._id === editing._id ? { ...item, ...data.data, owner: item.owner } : item) } : old);
        toast.success("Property updated");
        setEditing(null);
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
    return <div><span className="section-kicker">Admin dashboard</span><h1 className="mt-2 text-3xl font-black tracking-[-.04em]">All properties</h1><p className="mt-2 text-sm text-[var(--muted)]">Moderate submissions and keep marketplace listings accurate.</p><div className="mt-7 overflow-x-auto rounded-3xl border border-[var(--line)] bg-[var(--surface)]"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b border-[var(--line)] bg-emerald-50/60 text-xs uppercase tracking-wide text-[var(--muted)] dark:bg-emerald-950/50"><tr><th className="p-4">Property</th><th className="p-4">Owner</th><th className="p-4">Rent</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{result.data.map((property) => <tr key={property._id} className="border-b border-[var(--line)] last:border-0"><td className="p-4"><p className="font-black">{property.title}</p><p className="text-xs text-[var(--muted)]">{property.location}</p></td><td className="p-4"><p className="font-bold">{property.owner.name}</p><p className="text-xs text-[var(--muted)]">{property.owner.email}</p></td><td className="p-4 font-bold">${property.rent.toLocaleString()}</td><td className="p-4"><Chip size="sm" color={property.status === "approved" ? "success" : property.status === "rejected" ? "danger" : "warning"} className="capitalize">{property.status}</Chip></td><td className="p-4"><div className="flex gap-1">{property.status !== "approved" && <Button isIconOnly size="sm" color="success" variant="flat" aria-label="Approve" onPress={() => setModerating({ property, status: "approved" })}><Check size={16}/></Button>}{property.status !== "rejected" && <Button isIconOnly size="sm" color="danger" variant="flat" aria-label="Reject" onPress={() => setModerating({ property, status: "rejected" })}><X size={16}/></Button>}<Button isIconOnly size="sm" variant="flat" aria-label="Update" onPress={() => beginEdit(property)}><Edit3 size={16}/></Button><Button isIconOnly size="sm" color="danger" variant="light" aria-label="Delete" onPress={() => setDeleting(property)}><Trash2 size={16}/></Button></div></td></tr>)}{!result.data.length && <tr><td colSpan={5} className="p-10 text-center text-[var(--muted)]">No properties found.</td></tr>}</tbody></table></div><div className="mt-5 flex justify-center gap-3"><Button variant="flat" isDisabled={pg.page <= 1} onPress={() => setPage((old) => old - 1)}>Previous</Button><span className="py-2 text-sm font-bold">Page {pg.page} of {pg.pages}</span><Button variant="flat" isDisabled={pg.page >= pg.pages} onPress={() => setPage((old) => old + 1)}>Next</Button></div><Modal isOpen={!!moderating} onOpenChange={(open) => !open && setModerating(null)}><ModalContent>{(onClose) => <><ModalHeader>{moderating?.status === "approved" ? "Approve property?" : "Reject property?"}</ModalHeader><ModalBody>{moderating?.status === "rejected" ? <Textarea label="Rejection feedback" placeholder="Explain what the owner should update before resubmission" value={feedback} onValueChange={setFeedback} isRequired/> : <p className="text-sm text-[var(--muted)]">This property will become publicly searchable for tenants.</p>}</ModalBody><ModalFooter><Button variant="light" onPress={onClose}>Cancel</Button><Button color={moderating?.status === "approved" ? "success" : "danger"} isLoading={saving} onPress={moderate}>Confirm</Button></ModalFooter></>}</ModalContent></Modal><Modal isOpen={!!editing} onOpenChange={(open) => !open && setEditing(null)}><ModalContent>{(onClose) => <><ModalHeader>Update property</ModalHeader><ModalBody><div className="grid gap-3"><Input label="Property title" value={editForm.title} onValueChange={(value) => setEditForm((old) => ({ ...old, title: value }))}/><Textarea label="Description" minRows={4} value={editForm.description} onValueChange={(value) => setEditForm((old) => ({ ...old, description: value }))}/><Input label="Location" value={editForm.location} onValueChange={(value) => setEditForm((old) => ({ ...old, location: value }))}/><div className="grid grid-cols-2 gap-3"><Input label="Rent" type="number" value={editForm.rent} onValueChange={(value) => setEditForm((old) => ({ ...old, rent: value }))}/><Input label="Property size" type="number" value={editForm.propertySize} onValueChange={(value) => setEditForm((old) => ({ ...old, propertySize: value }))}/><Input label="Bedrooms" type="number" value={editForm.bedrooms} onValueChange={(value) => setEditForm((old) => ({ ...old, bedrooms: value }))}/><Input label="Bathrooms" type="number" value={editForm.bathrooms} onValueChange={(value) => setEditForm((old) => ({ ...old, bathrooms: value }))}/></div><Input label="Amenities" description="Separate with commas" value={editForm.amenities} onValueChange={(value) => setEditForm((old) => ({ ...old, amenities: value }))}/><Input label="Extra features" description="Separate with commas" value={editForm.extraFeatures} onValueChange={(value) => setEditForm((old) => ({ ...old, extraFeatures: value }))}/></div></ModalBody><ModalFooter><Button variant="light" onPress={onClose}>Cancel</Button><Button isLoading={saving} onPress={saveEdit} className="bg-[var(--brand)] font-bold text-white">Save changes</Button></ModalFooter></>}</ModalContent></Modal><Modal isOpen={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}><ModalContent>{(onClose) => <><ModalHeader>Delete property?</ModalHeader><ModalBody><p className="text-sm text-[var(--muted)]">This deletes <strong>{deleting?.title}</strong> from the marketplace.</p></ModalBody><ModalFooter><Button variant="light" onPress={onClose}>Cancel</Button><Button color="danger" isLoading={saving} onPress={remove}>Delete</Button></ModalFooter></>}</ModalContent></Modal></div>;
}
