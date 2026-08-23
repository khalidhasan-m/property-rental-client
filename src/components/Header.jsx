"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
const navigation = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "All properties" },
];
export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isLoading } = useAuth();
    const { theme, setTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const onLogout = async () => {
        await logout();
        toast.success("You have been signed out.");
        router.push("/");
    };
    return (<header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color:var(--background)]/90 backdrop-blur-xl">
      <div className="container-shell flex h-18 items-center justify-between gap-4 py-3">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <span className="grid size-10 place-items-center rounded-2xl bg-[var(--brand)] text-lg font-black text-white shadow-lg shadow-emerald-950/20 transition-transform group-hover:-rotate-6">N</span>
          <span className="text-xl font-black tracking-tight">Nestora</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navigation.map((item) => (<Link key={item.href} href={item.href} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${pathname === item.href ? "bg-emerald-950 text-white" : "text-[var(--muted)] hover:bg-emerald-50 hover:text-emerald-900 dark:hover:bg-emerald-950"}`}>
              {item.label}
            </Link>))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button isIconOnly variant="light" aria-label="Toggle color theme" onPress={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}
          </Button>
          {!isLoading && user ? (<>
              <Link href="/dashboard"><Button variant="flat" className="font-bold">Dashboard</Button></Link>
              <Button color="primary" className="bg-[var(--brand)] font-bold text-white" onPress={onLogout}>Logout</Button>
            </>) : !isLoading ? (<>
              <Link href="/login"><Button variant="light" className="font-bold">Login</Button></Link>
              <Link href="/register"><Button className="bg-[var(--brand)] font-bold text-white">Register</Button></Link>
            </>) : null}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Button isIconOnly variant="light" aria-label="Toggle color theme" onPress={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}
          </Button>
          <Button isIconOnly variant="light" aria-label="Open navigation" onPress={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.18 }} className="border-t border-[var(--line)] bg-[var(--surface)] px-4 py-4 md:hidden">
            <nav className="container-shell grid gap-2" aria-label="Mobile navigation">
              {navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950">{item.label}</Link>)}
              {user ? <><Link href="/dashboard" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950">Dashboard</Link><button onClick={onLogout} className="rounded-xl px-4 py-3 text-left font-bold text-rose-600">Logout</button></> : <><Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 font-bold">Login</Link><Link href="/register" onClick={() => setMenuOpen(false)} className="rounded-xl bg-[var(--brand)] px-4 py-3 font-bold text-white">Register</Link></>}
            </nav>
          </motion.div>)}
      </AnimatePresence>
    </header>);
}
