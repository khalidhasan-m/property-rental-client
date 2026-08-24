"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { ArrowLeft, Home } from "lucide-react";
import { NestoraLogo } from "@/components/NestoraLogo";
import { StandalonePage } from "@/components/LayoutWrapper";

export default function NotFound() {
    const router = useRouter();

    return (
        <StandalonePage>
            <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 grid place-items-center py-16">
                <section className="relative w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-[var(--line)] bg-[var(--surface)] p-8 text-center shadow-2xl shadow-emerald-950/10 sm:p-12">
                    {/* Decorative Glowing Orbs */}
                    <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-amber-400/10 blur-3xl" />
                    <div className="pointer-events-none absolute -right-20 -bottom-20 size-64 rounded-full bg-emerald-500/10 blur-3xl" />

                    {/* Brand Logo & 404 Badge */}
                    <div className="relative mx-auto flex flex-col items-center gap-3">
                        <NestoraLogo size={64} className="animate-pulse" />
                        <span className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500">
                            404
                        </span>
                    </div>

                    {/* Messaging */}
                    <h1 className="mt-4 text-3xl font-black tracking-[-0.03em] sm:text-4xl">This page took a wrong turn</h1>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                        We couldn't find the page or rental listing you were looking for. It may have been moved, renamed, or is no longer listed.
                    </p>

                    {/* Quick Navigation Action Buttons */}
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button
                            size="lg"
                            onPress={() => router.back()}
                            className="w-full rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-600 font-bold text-white shadow-lg shadow-emerald-950/20 hover:shadow-xl transition-all"
                            startContent={<ArrowLeft size={18} />}
                        >
                            Go back
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
