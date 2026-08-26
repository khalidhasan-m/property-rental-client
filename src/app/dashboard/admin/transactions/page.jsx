"use client";
import { useEffect, useState } from "react";
import { Button, Chip } from "@heroui/react";
import { api } from "@/lib/api";
import { LoadingState } from "@/components/LoadingState";
export default function TransactionsPage() {
    const [result, setResult] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    useEffect(() => { setLoading(true); api.get("/admin/transactions", { params: { page, limit: 10 } }).then(({ data }) => setResult({ data: data.data, pagination: data.pagination })).catch(() => setResult({ data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } })).finally(() => setLoading(false)); }, [page]);
    if (loading && !result)
        return <LoadingState label="Loading transactions…"/>;
    const pg = result.pagination;
    return <div><span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Admin dashboard</span><h1 className="mt-2 text-3xl font-black tracking-[-.04em]">Transactions</h1><p className="mt-2 text-sm text-[var(--muted)]">A complete ledger of successful reservation payments.</p><div className="mt-7 min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-3xl border border-[var(--line)] bg-[var(--surface)]"><table className="dashboard-table w-full min-w-[920px] lg:min-w-0 text-left text-sm"><thead className="border-b border-[var(--line)] bg-emerald-50/60 text-xs uppercase tracking-wide text-[var(--muted)] dark:bg-emerald-950/50"><tr><th className="p-4">Transaction ID</th><th className="p-4">Property</th><th className="p-4">Tenant</th><th className="p-4">Owner</th><th className="p-4">Amount</th><th className="p-4">Date</th></tr></thead><tbody>{result.data.map((item) => <tr key={item._id} className="border-b border-[var(--line)] last:border-0"><td className="p-4"><p className="max-w-36 truncate font-mono text-xs">{item.stripePaymentIntentId}</p><Chip size="sm" color={item.status === "succeeded" ? "success" : "default"} className="mt-1">{item.status}</Chip></td><td className="p-4 font-bold">{item.property.title}</td><td className="p-4">{item.tenant.name}</td><td className="p-4">{item.owner.name}</td><td className="p-4 font-black">${item.amount.toLocaleString()}</td><td className="p-4">{new Date(item.createdAt).toLocaleDateString()}</td></tr>)}{!result.data.length && <tr><td colSpan={6} className="p-10 text-center text-[var(--muted)]">No transactions yet.</td></tr>}</tbody></table></div><div className="mt-5 flex justify-center gap-3"><Button variant="flat" isDisabled={pg.page <= 1} onPress={() => setPage((old) => old - 1)}>Previous</Button><span className="py-2 text-sm font-bold">Page {pg.page} of {pg.pages}</span><Button variant="flat" isDisabled={pg.page >= pg.pages} onPress={() => setPage((old) => old + 1)}>Next</Button></div></div>;
}
