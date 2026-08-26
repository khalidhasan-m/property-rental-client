"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Building2, CalendarDays, Heart, Landmark, LayoutDashboard, PlusSquare, ReceiptText, Shield, UserRound, Users, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingState } from "@/components/LoadingState";
import toast from "react-hot-toast";

const links = {
    tenant: [
        { href: "/dashboard/tenant/bookings", label: "My bookings", icon: CalendarDays },
        { href: "/dashboard/tenant/favorites", label: "Saved homes", icon: Heart },
    ],
    owner: [
        { href: "/dashboard/owner", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/owner/properties/add", label: "Add property", icon: PlusSquare },
        { href: "/dashboard/owner/properties", label: "My properties", icon: Building2 },
        { href: "/dashboard/owner/booking-requests", label: "Booking requests", icon: ReceiptText },
    ],
    admin: [
        { href: "/dashboard/admin/users", label: "All users", icon: Users },
        { href: "/dashboard/admin/properties", label: "Properties", icon: Building2 },
        { href: "/dashboard/admin/bookings", label: "Bookings", icon: CalendarDays },
        { href: "/dashboard/admin/transactions", label: "Transactions", icon: Landmark },
    ],
};

const ROLE_LABEL = { tenant: "Tenant", owner: "Property Owner", admin: "Administrator" };
const ROLE_COLOR = {
    tenant: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    owner: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    admin: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
};

export function DashboardShell({ children }) {
    const { user, isLoading, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) router.replace("/login");
    }, [isLoading, user, router]);

    useEffect(() => {
        if (!isLoading && user && pathname === "/dashboard") {
            const fallback = user.role === "tenant" ? "/dashboard/tenant/bookings"
                : user.role === "owner" ? "/dashboard/owner"
                : "/dashboard/admin/users";
            router.replace(fallback);
        }
    }, [isLoading, user, pathname, router]);

    const onLogout = async () => {
        await logout();
        toast.success("You've been signed out.");
        router.push("/");
    };

    if (isLoading || !user) return <LoadingState label="Restoring your dashboard…"/>;

    const roleLinks = links[user.role] || [];
    const initials = user.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

    return (
        <div className="bg-[var(--background)] min-h-screen overflow-x-clip">
            <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6 lg:py-8">
                {/* Sidebar */}
                <aside className="shrink-0 lg:w-64">
                    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-sm)] overflow-hidden lg:sticky lg:top-[4.5rem]">
                        {/* User info */}
                        <div className="border-b border-[var(--line)] bg-gradient-to-br from-emerald-950 to-emerald-800 p-4">
                            <div className="flex items-center gap-3">
                                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/20 text-base font-black text-white backdrop-blur-sm">
                                    {initials}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-black text-white">{user.name}</p>
                                    <p className="truncate text-xs text-emerald-200">{user.email}</p>
                                </div>
                            </div>
                            <span className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${ROLE_COLOR[user.role]}`}>
                                {ROLE_LABEL[user.role] || user.role}
                            </span>
                        </div>

                        {/* Navigation */}
                        <nav className="p-2 flex gap-1 overflow-x-auto lg:grid" aria-label="Dashboard navigation">
                            {roleLinks.map((item) => {
                                const bestMatch = roleLinks
                                    .filter(l => pathname === l.href || pathname.startsWith(l.href + "/"))
                                    .sort((a, b) => b.href.length - a.href.length)[0];
                                const active = bestMatch && bestMatch.href === item.href;
                                return (
                                    <Link key={item.href} href={item.href}
                                        className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
                                            active
                                                ? "bg-[var(--brand)] text-white shadow-sm"
                                                : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                                        }`}>
                                        <item.icon size={16} className="shrink-0"/>
                                        <span>{item.label}</span>
                                        {active && <ChevronRight size={14} className="ml-auto opacity-60"/>}
                                    </Link>
                                );
                            })}

                            <div className="my-1 h-px bg-[var(--line)] hidden lg:block"/>

                            <Link href="/dashboard/profile"
                                className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
                                    pathname === "/dashboard/profile"
                                        ? "bg-[var(--brand)] text-white shadow-sm"
                                        : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                                }`}>
                                <UserRound size={16} className="shrink-0"/>
                                Profile
                            </Link>
                        </nav>

                        {/* Footer actions */}
                        <div className="border-t border-[var(--line)] p-2">
                            <button onClick={onLogout}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--muted)] transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30">
                                <LogOut size={16} className="shrink-0"/>
                                Sign out
                            </button>
                            <div className="mt-2 flex items-center gap-2 rounded-xl bg-[var(--brand-light)] px-3 py-2.5 text-xs font-semibold text-[var(--brand)]">
                                <Shield size={13} className="shrink-0"/>
                                Secure role-based access
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <section className="min-w-0 flex-1 animate-fadeUp">
                    {children}
                </section>
            </div>
        </div>
    );
}
