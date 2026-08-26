"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Menu, Moon, Sun, X, LogOut, LayoutDashboard, Home, Building2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { NestoraLogo } from "@/components/NestoraLogo";

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoading, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close menu on route change
    useEffect(() => setMenuOpen(false), [pathname]);

    const onLogout = async () => {
        await logout();
        toast.success("You've been signed out.");
        router.push("/");
    };

    const initials = user?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";
    const firstName = user?.name ? user.name.trim().split(" ")[0] : "";

    const navItems = user
        ? [
              { href: "/", label: "Home", icon: Home },
              { href: "/properties", label: "Browse", icon: Building2 },
              { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
          ]
        : [
              { href: "/", label: "Home", icon: Home },
              { href: "/properties", label: "Browse", icon: Building2 },
          ];

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-300 border-b border-[var(--line)] ${
            scrolled
                ? "bg-[var(--surface)]/95 shadow-md shadow-emerald-950/5 backdrop-blur-2xl"
                : "bg-[var(--surface)]/90 backdrop-blur-xl shadow-xs"
        }`}>
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="group flex items-center gap-3 shrink-0">
                    <NestoraLogo size={36} className="transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6" />
                    <span className="text-xl font-black tracking-tight text-[var(--foreground)]">Nestora</span>
                </Link>

                {/* Desktop Nav Links with Icons */}
                <nav className="hidden items-center gap-1.5 md:flex" aria-label="Main navigation">
                    {navItems.map((item) => {
                        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        const Icon = item.icon;
                        return (
                            <Link key={item.href} href={item.href}
                                className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                                    active
                                        ? "text-[var(--brand)]"
                                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                                }`}>
                                <Icon size={16} />
                                <span>{item.label}</span>
                                {active && (
                                    <motion.span layoutId="nav-pill"
                                        className="absolute inset-0 rounded-full bg-[var(--brand-light)] border border-[var(--brand)]/15"
                                        style={{ zIndex: -1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop Right Controls */}
                <div className="hidden items-center gap-2.5 md:flex">
                    <Button
                        isIconOnly
                        variant="flat"
                        size="sm"
                        aria-label="Toggle theme"
                        onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-[var(--foreground)] hover:bg-[var(--line)] transition-colors"
                    >
                        {theme === "dark" ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-600" />}
                    </Button>

                    {!isLoading && user ? (
                        <div className="flex items-center gap-3">
                            {/* User Avatar + Name Identity */}
                            <div className="flex items-center gap-2.5 px-1">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.name}
                                        className="size-8 shrink-0 rounded-full object-cover ring-2 ring-emerald-500/30 shadow-xs"
                                    />
                                ) : (
                                    <div className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-xs font-black text-white shadow-xs ring-2 ring-emerald-500/20">
                                        {initials}
                                    </div>
                                )}
                                <span className="max-w-[130px] truncate text-sm font-extrabold text-[var(--foreground)]">
                                    {firstName}
                                </span>
                            </div>

                            {/* Separate Sign out button */}
                            <Button
                                variant="light"
                                size="sm"
                                onPress={onLogout}
                                className="rounded-xl font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                startContent={<LogOut size={15} />}
                            >
                                Sign out
                            </Button>
                        </div>
                    ) : !isLoading ? (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="light" size="sm" className="rounded-xl font-bold text-[var(--muted)] hover:text-[var(--foreground)]">
                                    Log in
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 font-bold text-white shadow-md shadow-emerald-950/20 hover:shadow-lg transition-all">
                                    Register
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="h-8 w-24 skeleton rounded-xl"/>
                    )}
                </div>

                {/* Mobile controls */}
                <div className="flex items-center gap-1.5 md:hidden">
                    <Button
                        isIconOnly
                        variant="flat"
                        size="sm"
                        aria-label="Toggle theme"
                        onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)]"
                    >
                        {theme === "dark" ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-600" />}
                    </Button>
                    <Button
                        isIconOnly
                        variant="flat"
                        size="sm"
                        aria-label="Open navigation"
                        onPress={() => setMenuOpen(open => !open)}
                        className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)]"
                    >
                        {menuOpen ? <X size={20}/> : <Menu size={20}/>}
                    </Button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden border-t border-[var(--line)] bg-[var(--surface)] md:hidden shadow-lg"
                    >
                        <nav className="mx-auto w-full max-w-7xl px-4 py-4 grid gap-1.5" aria-label="Mobile navigation">
                            {navItems.map((item) => {
                                const active = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link key={item.href} href={item.href}
                                        className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                                            active
                                                ? "bg-[var(--brand-light)] text-[var(--brand)] border border-[var(--brand)]/20"
                                                : "hover:bg-[var(--surface-2)] text-[var(--foreground)]"
                                        }`}>
                                        <Icon size={18} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                            <div className="my-1 h-px bg-[var(--line)]"/>
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 rounded-xl bg-[var(--surface-2)] px-4 py-3 border border-[var(--line)]">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt={user.name} className="size-8 shrink-0 rounded-full object-cover border border-emerald-500/30" />
                                        ) : (
                                            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-xs font-black text-white">{initials}</div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold">{firstName}</p>
                                            <p className="text-xs capitalize text-[var(--muted)]">{user.role}</p>
                                        </div>
                                    </div>
                                    <button onClick={onLogout} className="rounded-xl px-4 py-3 text-left text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-2">
                                        <LogOut size={16} />
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="rounded-xl px-4 py-3 text-sm font-bold hover:bg-[var(--surface-2)] text-[var(--foreground)] transition-colors">Log in</Link>
                                    <Link href="/register" className="rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-3 text-sm font-bold text-white text-center shadow-md">
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
