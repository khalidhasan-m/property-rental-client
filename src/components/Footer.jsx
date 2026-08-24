import Link from "next/link";
import { Building2, Mail, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { NestoraLogo } from "@/components/NestoraLogo";

const footerLinks = {
    explore: [
        { href: "/properties", label: "All Properties" },
        { href: "/properties?sort=newest", label: "New Listings" },
        { href: "/properties?propertyType=Apartment", label: "Apartments" },
        { href: "/properties?propertyType=House", label: "Houses" },
        { href: "/properties?propertyType=Studio", label: "Studios" },
    ],
    company: [
        { href: "/register", label: "List Your Property" },
        { href: "/register", label: "Become an Owner" },
        { href: "/dashboard", label: "Tenant Dashboard" },
        { href: "/dashboard/owner/properties", label: "Owner Dashboard" },
    ],
    account: [
        { href: "/register", label: "Create Account" },
        { href: "/login", label: "Sign In" },
        { href: "/dashboard/profile", label: "Profile Settings" },
        { href: "/dashboard/tenant/bookings", label: "My Bookings" },
    ],
};

const stats = [
    { icon: Building2, value: "500+", label: "Listed properties" },
    { icon: ShieldCheck, value: "100%", label: "Verified listings" },
    { icon: Star, value: "4.8★", label: "Avg. tenant rating" },
];

const socialLinks = [
    { href: "https://twitter.com", label: "X (Twitter)", icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path stroke="none" fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg> },
    { href: "https://facebook.com", label: "Facebook", icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
    { href: "https://instagram.com", label: "Instagram", icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> },
    { href: "https://github.com", label: "GitHub", icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> },
];

export function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="mt-auto border-t border-[var(--line)] bg-[var(--surface)]">
            {/* Stats bar */}
            <div className="border-b border-white/10 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950">
                <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 grid grid-cols-3 divide-x divide-white/10 py-5">
                    {stats.map(({ icon: Icon, value, label }) => (
                        <div key={label} className="flex flex-col items-center gap-1 px-4 text-center sm:flex-row sm:justify-center sm:gap-3">
                            <Icon size={18} className="text-emerald-300 shrink-0" />
                            <div>
                                <p className="text-sm font-black text-white">{value}</p>
                                <p className="hidden text-xs text-emerald-300 sm:block">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main footer body */}
            <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 grid gap-10 py-14 md:grid-cols-[1.8fr_1fr_1fr_1fr]">
                {/* Brand column */}
                <div>
                    <Link href="/" className="group mb-4 inline-flex items-center gap-2.5">
                        <NestoraLogo size={36} className="transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6" />
                        <span className="text-xl font-black">Nestora</span>
                    </Link>
                    <p className="max-w-xs text-sm leading-7 text-[var(--muted)]">
                        A transparent, moderated rental marketplace connecting owners and tenants with confidence, security, and care.
                    </p>

                    {/* Contact info */}
                    <div className="mt-6 grid gap-2.5 text-sm text-[var(--muted)]">
                        <span className="flex items-center gap-2.5">
                            <Mail size={15} className="text-[var(--brand)] shrink-0" />
                            support@nestora.com
                        </span>
                        <span className="flex items-center gap-2.5">
                            <Phone size={15} className="text-[var(--brand)] shrink-0" />
                            +880 1700-000000
                        </span>
                        <span className="flex items-center gap-2.5">
                            <MapPin size={15} className="text-[var(--brand)] shrink-0" />
                            Dhaka, Bangladesh
                        </span>
                    </div>

                    {/* Social links */}
                    <div className="mt-6 flex gap-2">
                        {socialLinks.map(({ href, icon: Icon, label }) => (
                            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                                className="grid size-9 place-items-center rounded-xl border border-[var(--line)] text-[var(--muted)] transition-all hover:border-[var(--brand)] hover:text-[var(--brand)] hover:bg-[var(--brand-light)]">
                                <Icon size={15} width={15} height={15} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Explore */}
                <div>
                    <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--foreground)]">Explore</h3>
                    <div className="grid gap-2.5">
                        {footerLinks.explore.map(({ href, label }) => (
                            <Link key={href + label} href={href} className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand)]">{label}</Link>
                        ))}
                    </div>
                </div>

                {/* Company */}
                <div>
                    <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--foreground)]">Owners</h3>
                    <div className="grid gap-2.5">
                        {footerLinks.company.map(({ href, label }) => (
                            <Link key={href + label} href={href} className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand)]">{label}</Link>
                        ))}
                    </div>
                </div>

                {/* Account */}
                <div>
                    <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--foreground)]">Account</h3>
                    <div className="grid gap-2.5">
                        {footerLinks.account.map(({ href, label }) => (
                            <Link key={href + label} href={href} className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand)]">{label}</Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-[var(--line)]">
                <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 py-5">
                    <p className="text-xs text-[var(--muted)]">
                        © {year} <strong className="text-[var(--foreground)]">Nestora</strong>. All rights reserved. Built for better rental decisions.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]">
                        <span>Secure</span>
                        <span className="size-1 rounded-full bg-[var(--muted)]" />
                        <span>Transparent</span>
                        <span className="size-1 rounded-full bg-[var(--muted)]" />
                        <span>Moderated</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
