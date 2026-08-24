import { NestoraLogo } from "@/components/NestoraLogo";

export function LoadingState({ label = "Loading Nestora…" }) {
    return (
        <div className="grid min-h-[50vh] place-items-center px-4 py-12">
            <div className="flex flex-col items-center gap-5 text-center">
                {/* Brand Logo with Pulsing Aura Ring */}
                <div className="relative grid place-items-center">
                    <div className="absolute -inset-3 animate-ping rounded-full bg-emerald-500/15 duration-1000" />
                    <div className="absolute -inset-2 animate-pulse rounded-full border border-[var(--brand)]/30" />
                    <div className="relative grid size-16 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-lg shadow-emerald-950/5 backdrop-blur-xl">
                        <NestoraLogo size={42} className="animate-bounce" />
                    </div>
                </div>

                {/* Animated Loading Text */}
                <div className="space-y-1">
                    <p className="text-base font-extrabold tracking-tight text-[var(--foreground)]">{label}</p>
                    <p className="text-xs font-semibold text-[var(--muted)]">Gathering your rental experience…</p>
                </div>

                {/* Animated Progress Bar Indicator */}
                <div className="h-1.5 w-36 overflow-hidden rounded-full bg-[var(--surface-2)]">
                    <div className="h-full w-1/2 animate-[shimmer_1.5s_infinite] rounded-full bg-gradient-to-r from-[var(--brand)] via-emerald-400 to-[var(--brand)]" />
                </div>
            </div>
        </div>
    );
}
