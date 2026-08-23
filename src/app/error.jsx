"use client";
import { Button } from "@heroui/react";
import { AlertTriangle } from "lucide-react";
export default function GlobalError({ reset }) {
    return <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 grid min-h-[60vh] place-items-center py-12"><section className="max-w-md rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-950 dark:bg-amber-950/30"><AlertTriangle className="mx-auto text-amber-600" size={44}/><h1 className="mt-4 text-2xl font-black">We could not load this view.</h1><p className="mt-3 text-sm leading-6 text-[var(--muted)]">Please try again. If the issue persists, return to the homepage and continue browsing properties.</p><Button className="mt-6 bg-[var(--brand)] font-bold text-white" onPress={reset}>Try again</Button></section></div>;
}
