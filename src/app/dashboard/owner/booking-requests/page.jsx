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
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    useEffect(() => {
        setLoading(true);
        api.get("/bookings/owner", { params: { page, limit: 10 } })
            .then(({ data }) => {
                setItems(data.data || []);
                setPagination(data.pagination || { page, limit: 10, total: 0, pages: 1 });
            })
            .catch(() => {
                setItems([]);
                setPagination({ page: 1, limit: 10, total: 0, pages: 1 });
            })
            .finally(() => setLoading(false));
    }, [page]);
    const decide = async () => {
        if (!decision) return;
        if (decision.status === "approved" && decision.booking.paymentStatus !== "paid") {
            toast.error("Payment must be completed before approving this booking");
            setDecision(null);
            return;
        }
        setSaving(true);
        try {
            await api.patch(`/bookings/${decision.booking._id}/decision`, { bookingStatus: decision.status });
            setItems((old) => old.map((item) => item._id === decision.booking._id ? { ...item, bookingStatus: decision.status } : item));
            toast.success(`Booking ${decision.status}`);
            setDecision(null);
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        } finally {
            setSaving(false);
        }
    };
    if (loading)
        return <LoadingState label="Loading booking requests…"/>;
    return <div><span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Owner dashboard</span><h1 className="mt-2 text-3xl font-black tracking-[-.04em]">Booking requests</h1><p className="mt-2 text-sm text-[var(--muted)]">Review tenant requests and make a clear approval decision.</p><div className="mt-7 min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-3xl border border-[var(--line)] bg-[var(--surface)]"><table className="dashboard-table w-full min-w-[900px] lg:min-w-0 text-left text-sm"><thead className="border-b border-[var(--line)] bg-emerald-50/60 text-xs uppercase tracking-wide text-[var(--muted)] dark:bg-emerald-950/50"><tr><th className="p-4">Tenant</th><th className="p-4">Property</th><th className="p-4">Move-in</th><th className="p-4">Amount</th><th className="p-4">Payment</th><th className="p-4">Action</th></tr></thead><tbody>{items.map((item) => <tr key={item._id} className="border-b border-[var(--line)] last:border-0"><td className="p-4"><p className="font-black">{item.tenant.name}</p><p className="text-xs text-[var(--muted)]">{item.tenant.email}</p></td><td className="p-4 font-bold">{item.property.title}</td><td className="p-4">{new Date(item.moveInDate).toLocaleDateString()}</td><td className="p-4 font-bold">${item.amount.toLocaleString()}</td><td className="p-4"><Chip size="sm" color={item.paymentStatus === "paid" ? "success" : "default"}>{item.paymentStatus}</Chip></td><td className="p-4">{item.bookingStatus === "pending" ? <div className="flex gap-2"><Button size="sm" color="success" variant="flat" isDisabled={item.paymentStatus !== "paid"} onPress={() => setDecision({ booking: item, status: "approved" })}>{item.paymentStatus === "paid" ? "Approve" : "Awaiting payment"}</Button><Button size="sm" color="danger" variant="flat" onPress={() => setDecision({ booking: item, status: "rejected" })}>Reject</Button></div> : <Chip size="sm" color={item.bookingStatus === "approved" ? "success" : "danger"} className="capitalize">{item.bookingStatus}</Chip>}</td></tr>)}{!items.length && <tr><td colSpan={6} className="p-10 text-center text-[var(--muted)]">No booking requests yet.</td></tr>}</tbody></table></div><div className="mt-5 flex justify-center gap-3"><Button variant="flat" isDisabled={loading || pagination.page <= 1} onPress={() => setPage((old) => old - 1)}>Previous</Button><span className="py-2 text-sm font-bold">Page {pagination.page} of {pagination.pages}</span><Button variant="flat" isDisabled={loading || pagination.page >= pagination.pages} onPress={() => setPage((old) => old + 1)}>Next</Button></div><Modal isOpen={!!decision} onOpenChange={(open) => !open && setDecision(null)}><ModalContent>{(onClose) => <><ModalHeader>{decision?.status === "approved" ? "Approve booking?" : "Reject booking?"}</ModalHeader><ModalBody><p className="text-sm text-[var(--muted)]">{decision?.status === "approved" ? "The tenant will see that their booking is approved." : "The tenant will see that their booking is rejected."}</p></ModalBody><ModalFooter><Button variant="light" onPress={onClose}>Cancel</Button><Button color={decision?.status === "approved" ? "success" : "danger"} isLoading={saving} onPress={decide}>Confirm</Button></ModalFooter></>}</ModalContent></Modal></div>;
}
