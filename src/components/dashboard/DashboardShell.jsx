"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Building2, CalendarDays, Heart, Landmark, LayoutDashboard, PlusSquare, ReceiptText, Shield, UserRound, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingState } from "@/components/LoadingState";
const links = {
    tenant: [{ href: "/dashboard/tenant/bookings", label: "My bookings", icon: CalendarDays }, { href: "/dashboard/tenant/favorites", label: "Favorites", icon: Heart }],
    owner: [{ href: "/dashboard/owner", label: "Overview", icon: LayoutDashboard }, { href: "/dashboard/owner/properties/add", label: "Add property", icon: PlusSquare }, { href: "/dashboard/owner/properties", label: "My properties", icon: Building2 }, { href: "/dashboard/owner/booking-requests", label: "Booking requests", icon: ReceiptText }],
    admin: [{ href: "/dashboard/admin/users", label: "All users", icon: Users }, { href: "/dashboard/admin/properties", label: "All properties", icon: Building2 }, { href: "/dashboard/admin/bookings", label: "All bookings", icon: CalendarDays }, { href: "/dashboard/admin/transactions", label: "Transactions", icon: Landmark }],
};
export function DashboardShell({ children }) {
    const { user, isLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    useEffect(() => { if (!isLoading && !user)
        router.replace("/login"); }, [isLoading, user, router]);
    useEffect(() => { if (!isLoading && user && pathname === "/dashboard") {
        const fallback = user.role === "tenant" ? "/dashboard/tenant/bookings" : user.role === "owner" ? "/dashboard/owner" : "/dashboard/admin/users";
        router.replace(fallback);
    } }, [isLoading, user, pathname, router]);
    if (isLoading || !user)
        return <LoadingState label="Restoring your dashboard…"/>;
    const roleLinks = links[user.role];
    return <div className="bg-[var(--background)]"><div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 py-6 lg:flex-row lg:px-7"><aside className="shrink-0 lg:w-64"><div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 lg:sticky lg:top-24"><div className="flex items-center gap-3 border-b border-[var(--line)] px-2 pb-4"><div className="grid size-10 place-items-center rounded-2xl bg-emerald-100 text-[var(--brand)]"><UserRound size={20}/></div><div className="min-w-0"><p className="truncate text-sm font-black">{user.name}</p><p className="text-xs font-bold capitalize text-[var(--muted)]">{user.role} account</p></div></div><nav className="mt-3 flex gap-1 overflow-x-auto lg:grid" aria-label="Dashboard navigation">{roleLinks.map((item) => { const active = pathname === item.href; return <Link key={item.href} href={item.href} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? "bg-emerald-950 text-white" : "text-[var(--muted)] hover:bg-emerald-50 hover:text-emerald-900 dark:hover:bg-emerald-950"}`}><item.icon size={17}/>{item.label}</Link>; })}<Link href="/dashboard/profile" className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${pathname === "/dashboard/profile" ? "bg-emerald-950 text-white" : "text-[var(--muted)] hover:bg-emerald-50 hover:text-emerald-900 dark:hover:bg-emerald-950"}`}><UserRound size={17}/>Profile</Link></nav><div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-3 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"><Shield size={15}/>Secure role-based access</div></div></aside><section className="min-w-0 flex-1">{children}</section></div></div>;
}
