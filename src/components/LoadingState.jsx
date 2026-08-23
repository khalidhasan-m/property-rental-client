export function LoadingState({ label = "Loading your space…" }) {
    return <div className="grid min-h-60 place-items-center"><div className="text-center"><div className="mx-auto mb-3 size-9 animate-spin rounded-full border-4 border-emerald-100 border-t-[var(--brand)]"/><p className="text-sm font-semibold text-[var(--muted)]">{label}</p></div></div>;
}
