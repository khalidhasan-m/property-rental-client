"use client";
import Link from "next/link";
import { Button } from "@heroui/react";
import { RefreshCw, Home, AlertCircle } from "lucide-react";
import { NestoraLogo } from "@/components/NestoraLogo";
import { StandalonePage } from "@/components/LayoutWrapper";

export default function GlobalError({ error, reset }) {
    return (
        <StandalonePage>
            <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 grid place-items-center py-16">
                <section className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-[var(--line)] bg-[var(--surface)] p-8 text-center shadow-2xl shadow-emerald-950/10 sm:p-11">
                    {/* Background Accent Blur */}
                    <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-rose-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -left-20 -bottom-20 size-60 rounded-full bg-emerald-500/10 blur-3xl" />

                    {/* Logo & Icon Badge */}
                    <div className="relative mx-auto flex size-20 items-center justify-center rounded-3xl border border-[var(--line)] bg-[var(--surface-2)] shadow-md">
                        <NestoraLogo size={48} />
                        <span className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full bg-rose-500 text-white shadow-md">
                            <AlertCircle size={15} />
                        </span>
                    </div>

                    {/* Main Content */}
                    <span className="mt-6 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-rose-600 dark:text-rose-400">
                        System Exception
                    </span>
                    <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl">Something went wrong</h1>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                        {error?.message || "We encountered an unexpected error while preparing this view. Please try reloading or head back to the main marketplace."}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button
                            size="lg"
                            onPress={reset}
                            className="rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-600 font-bold text-white shadow-lg shadow-emerald-950/20 hover:shadow-xl transition-all"
                            startContent={<RefreshCw size={18} />}
                        >
                            Try again
                        </Button>
                        <Link href="/">
                            <Button
                                size="lg"
                                variant="flat"
                                className="w-full rounded-2xl border border-[var(--line)] font-bold text-[var(--foreground)] bg-[var(--surface-2)] hover:bg-[var(--line)] transition-colors"
                                startContent={<Home size={18} />}
                            >
                                Return home
                            </Button>
                        </Link>
                    </div>
                </section>
            </div>
        </StandalonePage>
    );
}
