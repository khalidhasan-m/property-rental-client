"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Chip } from "@heroui/react";
import { api } from "@/lib/api";
import { LoadingState } from "@/components/LoadingState";
export default function TenantBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    useEffect(() => {
        setLoading(true);
        api.get("/bookings/mine", { params: { page, limit: 10 } })
            .then(({ data }) => {
            setBookings(data.data || []);
            setPagination(data.pagination || { page, limit: 10, total: 0, pages: 1 });
        })
            .catch(() => {
            setBookings([]);
            setPagination({ page: 1, limit: 10, total: 0, pages: 1 });
        })
            .finally(() => setLoading(false));
    }, [page]);
    if (loading)
        return <LoadingState label="Loading your bookings…"/>;
    return <div><span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Tenant dashboard</span><h1 className="mt-2 text-3xl font-black tracking-[-.04em]">My bookings</h1><p className="mt-2 text-sm text-[var(--muted)]">Track reservation payments and owner decisions in one place. Click on a property to view details or write a review.</p><div className="mt-7 min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-3xl border border-[var(--line)] bg-[var(--surface)]"><table className="dashboard-table w-full min-w-[720px] lg:min-w-0 text-left text-sm"><thead className="border-b border-[var(--line)] bg-emerald-50/60 text-xs uppercase tracking-wide text-[var(--muted)] dark:bg-emerald-950/50"><tr><th className="p-4">Property</th><th className="p-4">Booking date</th><th className="p-4">Amount paid</th><th className="p-4">Booking status</th><th className="p-4">Payment</th></tr></thead><tbody>{bookings.map((booking) => <tr key={booking._id} className="border-b border-[var(--line)] last:border-0"><td className="p-4 font-black"><Link href={`/properties/${booking.propertyId}`} className="hover:text-[var(--brand)] hover:underline transition-colors">{booking.property.title}</Link></td><td className="p-4">{new Date(booking.createdAt).toLocaleDateString()}</td><td className="p-4 font-bold">${booking.amount.toLocaleString()}</td><td className="p-4"><Chip size="sm" color={booking.bookingStatus === "approved" ? "success" : booking.bookingStatus === "rejected" ? "danger" : "warning"} className="capitalize">{booking.bookingStatus}</Chip></td><td className="p-4"><Chip size="sm" color={booking.paymentStatus === "paid" ? "success" : "default"} className="capitalize">{booking.paymentStatus}</Chip></td></tr>)}{!bookings.length && <tr><td colSpan={5} className="p-10 text-center text-[var(--muted)]">You have no bookings yet.</td></tr>}</tbody></table></div><div className="mt-5 flex justify-center gap-3"><Button variant="flat" isDisabled={loading || pagination.page <= 1} onPress={() => setPage((old) => old - 1)}>Previous</Button><span className="py-2 text-sm font-bold">Page {pagination.page} of {pagination.pages}</span><Button variant="flat" isDisabled={loading || pagination.page >= pagination.pages} onPress={() => setPage((old) => old + 1)}>Next</Button></div></div>;
}
