import Link from "next/link";
export function Footer() {
    return (<footer className="mt-auto border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="mb-3 flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] font-black text-white">N</span><span className="text-lg font-black">Nestora</span></div>
          <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">A calmer, more transparent way to find a rental that is right for your next chapter.</p>
        </div>
        <div><h2 className="mb-3 text-sm font-extrabold">Explore</h2><div className="grid gap-2 text-sm text-[var(--muted)]"><Link href="/properties" className="hover:text-[var(--brand)]">All properties</Link><Link href="/register" className="hover:text-[var(--brand)]">List your property</Link></div></div>
        <div><h2 className="mb-3 text-sm font-extrabold">Trusted renting</h2><p className="text-sm leading-6 text-[var(--muted)]">Secure booking requests, owner moderation, and transparent rental details in one place.</p></div>
      </div>
      <div className="border-t border-[var(--line)]"><div className="container-shell py-5 text-xs text-[var(--muted)]">© {new Date().getFullYear()} Nestora. Built for better rental decisions.</div></div>
    </footer>);
}
