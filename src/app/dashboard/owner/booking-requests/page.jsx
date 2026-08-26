"use client";
import { useEffect, useState } from "react";
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import toast from "react-hot-toast";
import { api, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/LoadingState";
export default function BookingRequestsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [decision, setDecision] = useState(null);
    const [saving, setSaving] = useState(false);
    useEffect(() => { api.get("/bookings/owner").then(({ data }) => setItems(data.data || [])).catch(() => setItems([])).finally(() => setLoading(false)); }, []);
    const decide = async () => { if (!decision)
        return; setSaving(true); try {
        await api.patch(`/bookings/${decision.booking._id}/decision`, { bookingStatus: decision.status });
        setItems((old) => old.map((item) => item._id === decision.booking._id ? { ...item, bookingStatus: decision.status } : item));
        toast.success(`Booking ${decision.status}`);
        setDecision(null);
    }
    catch (error) {
        toast.error(getApiErrorMessage(error));
    }
    finally {
        setSaving(false);
    } };
    if (loading)
        return <LoadingState label="Loading booking requests…"/>;
    return <div><span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Owner dashboard</span><h1 className="mt-2 text-3xl font-black tracking-[-.04em]">Booking requests</h1><p className="mt-2 text-sm text-[var(--muted)]">Review tenant requests and make a clear approval decision.</p><div className="mt-7 min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-3xl border border-[var(--line)] bg-[var(--surface)]"><table className="dashboard-table w-full min-w-[900px] lg:min-w-0 text-left text-sm"><thead className="border-b border-[var(--line)] bg-emerald-50/60 text-xs uppercase tracking-wide text-[var(--muted)] dark:bg-emerald-950/50"><tr><th className="p-4">Tenant</th><th className="p-4">Property</th><th className="p-4">Move-in</th><th className="p-4">Amount</th><th className="p-4">Payment</th><th className="p-4">Action</th></tr></thead><tbody>{items.map((item) => <tr key={item._id} className="border-b border-[var(--line)] last:border-0"><td className="p-4"><p className="font-black">{item.tenant.name}</p><p className="text-xs text-[var(--muted)]">{item.tenant.email}</p></td><td className="p-4 font-bold">{item.property.title}</td><td className="p-4">{new Date(item.moveInDate).toLocaleDateString()}</td><td className="p-4 font-bold">${item.amount.toLocaleString()}</td><td className="p-4"><Chip size="sm" color={item.paymentStatus === "paid" ? "success" : "default"}>{item.paymentStatus}</Chip></td><td className="p-4">{item.bookingStatus === "pending" ? <div className="flex gap-2"><Button size="sm" color="success" variant="flat" onPress={() => setDecision({ booking: item, status: "approved" })}>Approve</Button><Button size="sm" color="danger" variant="flat" onPress={() => setDecision({ booking: item, status: "rejected" })}>Reject</Button></div> : <Chip size="sm" color={item.bookingStatus === "approved" ? "success" : "danger"} className="capitalize">{item.bookingStatus}</Chip>}</td></tr>)}{!items.length && <tr><td colSpan={6} className="p-10 text-center text-[var(--muted)]">No booking requests yet.</td></tr>}</tbody></table></div><Modal isOpen={!!decision} onOpenChange={(open) => !open && setDecision(null)}><ModalContent>{(onClose) => <><ModalHeader>{decision?.status === "approved" ? "Approve booking?" : "Reject booking?"}</ModalHeader><ModalBody><p className="text-sm text-[var(--muted)]">{decision?.status === "approved" ? "The tenant will see that their booking is approved." : "The tenant will see that their booking is rejected."}</p></ModalBody><ModalFooter><Button variant="light" onPress={onClose}>Cancel</Button><Button color={decision?.status === "approved" ? "success" : "danger"} isLoading={saving} onPress={decide}>Confirm</Button></ModalFooter></>}</ModalContent></Modal></div>;
}
