"use client";
import { useEffect, useState } from "react";
import { Chip } from "@heroui/react";
import { api } from "@/lib/api";
import { LoadingState } from "@/components/LoadingState";
export default function AdminBookingsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => { api.get("/bookings/admin/all").then(({ data }) => setItems(data.data || [])).catch(() => setItems([])).finally(() => setLoading(false)); }, []);
    if (loading)
        return <LoadingState label="Loading booking activity…"/>;
    return <div><span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Admin dashboard</span><h1 className="mt-2 text-3xl font-black tracking-[-.04em]">All bookings</h1><p className="mt-2 text-sm text-[var(--muted)]">Monitor marketplace booking and payment activity.</p><div className="mt-7 overflow-x-auto rounded-3xl border border-[var(--line)] bg-[var(--surface)]"><table className="w-full min-w-[980px] text-left text-sm"><thead className="border-b border-[var(--line)] bg-emerald-50/60 text-xs uppercase tracking-wide text-[var(--muted)] dark:bg-emerald-950/50"><tr><th className="p-4">Tenant</th><th className="p-4">Property</th><th className="p-4">Owner</th><th className="p-4">Move-in</th><th className="p-4">Amount</th><th className="p-4">Booking</th><th className="p-4">Payment</th></tr></thead><tbody>{items.map((item) => <tr key={item._id} className="border-b border-[var(--line)] last:border-0"><td className="p-4"><p className="font-black">{item.tenant.name}</p><p className="text-xs text-[var(--muted)]">{item.tenant.email}</p></td><td className="p-4 font-bold">{item.property.title}</td><td className="p-4">{item.owner.name}</td><td className="p-4">{new Date(item.moveInDate).toLocaleDateString()}</td><td className="p-4 font-bold">${item.amount.toLocaleString()}</td><td className="p-4"><Chip size="sm" color={item.bookingStatus === "approved" ? "success" : item.bookingStatus === "rejected" ? "danger" : "warning"} className="capitalize">{item.bookingStatus}</Chip></td><td className="p-4"><Chip size="sm" color={item.paymentStatus === "paid" ? "success" : "default"} className="capitalize">{item.paymentStatus}</Chip></td></tr>)}{!items.length && <tr><td colSpan={7} className="p-10 text-center text-[var(--muted)]">No booking activity yet.</td></tr>}</tbody></table></div></div>;
}
