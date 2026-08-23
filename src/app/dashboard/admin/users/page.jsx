"use client";
import { useEffect, useState } from "react";
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@heroui/react";
import toast from "react-hot-toast";
import { api, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/LoadingState";
export default function AdminUsersPage() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selection, setSelection] = useState(null);
    const [saving, setSaving] = useState(false);
    const load = () => { setLoading(true); api.get("/admin/users", { params: { page, limit: 10 } }).then(({ data }) => setResult({ data: data.data, pagination: data.pagination })).catch(() => setResult({ data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } })).finally(() => setLoading(false)); };
    useEffect(() => { load(); }, [page]);
    const changeRole = async () => { if (!selection)
        return; setSaving(true); try {
        await api.patch(`/admin/users/${selection.user._id}/role`, { role: selection.role });
        setResult((old) => old ? { ...old, data: old.data.map((user) => user._id === selection.user._id ? { ...user, role: selection.role } : user) } : old);
        toast.success("User role updated");
        setSelection(null);
    }
    catch (error) {
        toast.error(getApiErrorMessage(error));
    }
    finally {
        setSaving(false);
    } };
    if (loading && !result)
        return <LoadingState label="Loading users…"/>;
    const pg = result.pagination;
    return <div><span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Admin dashboard</span><h1 className="mt-2 text-3xl font-black tracking-[-.04em]">All users</h1><p className="mt-2 text-sm text-[var(--muted)]">Manage marketplace access and role permissions.</p><div className="mt-7 overflow-x-auto rounded-3xl border border-[var(--line)] bg-[var(--surface)]"><table className="w-full min-w-[750px] text-left text-sm"><thead className="border-b border-[var(--line)] bg-emerald-50/60 text-xs uppercase tracking-wide text-[var(--muted)] dark:bg-emerald-950/50"><tr><th className="p-4">User</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Joined</th><th className="p-4">Change role</th></tr></thead><tbody>{result.data.map((user) => <tr key={user._id} className="border-b border-[var(--line)] last:border-0"><td className="p-4 font-black">{user.name}</td><td className="p-4">{user.email}</td><td className="p-4"><Chip size="sm" className="capitalize">{user.role}</Chip></td><td className="p-4">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td><td className="p-4"><Select aria-label="Change role" size="sm" className="w-32" selectedKeys={[user.role]} onSelectionChange={(keys) => { const role = Array.from(keys)[0]; if (role !== user.role)
        setSelection({ user, role }); }}><SelectItem key="tenant">Tenant</SelectItem><SelectItem key="owner">Owner</SelectItem><SelectItem key="admin">Admin</SelectItem></Select></td></tr>)}{!result.data.length && <tr><td colSpan={5} className="p-10 text-center text-[var(--muted)]">No users found.</td></tr>}</tbody></table></div><div className="mt-5 flex justify-center gap-3"><Button variant="flat" isDisabled={pg.page <= 1} onPress={() => setPage((old) => old - 1)}>Previous</Button><span className="py-2 text-sm font-bold">Page {pg.page} of {pg.pages}</span><Button variant="flat" isDisabled={pg.page >= pg.pages} onPress={() => setPage((old) => old + 1)}>Next</Button></div><Modal isOpen={!!selection} onOpenChange={(open) => !open && setSelection(null)}><ModalContent>{(onClose) => <><ModalHeader>Confirm role change</ModalHeader><ModalBody><p className="text-sm text-[var(--muted)]">Change <strong>{selection?.user.name}</strong> to <strong className="capitalize">{selection?.role}</strong>? This immediately changes their permissions.</p></ModalBody><ModalFooter><Button variant="light" onPress={onClose}>Cancel</Button><Button isLoading={saving} className="bg-[var(--brand)] font-bold text-white" onPress={changeRole}>Confirm</Button></ModalFooter></>}</ModalContent></Modal></div>;
}
