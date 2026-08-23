"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ShieldCheck } from "lucide-react";
import { api, getApiErrorMessage } from "@/lib/api";
import { PaymentCheckout } from "@/components/PaymentCheckout";
import { LoadingState } from "@/components/LoadingState";
export default function PaymentPage() {
    const params = useSearchParams();
    const bookingId = params.get("bookingId");
    const [clientSecret, setClientSecret] = useState("");
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState("");
    const stripe = useMemo(() => process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) : null, []);
    useEffect(() => { if (!bookingId) {
        setError("A booking reference is required before payment.");
        return;
    } api.post("/bookings/payment-intent", { bookingId }).then(({ data }) => { setClientSecret(data.data.clientSecret); setAmount(data.data.amount); }).catch((requestError) => setError(getApiErrorMessage(requestError))); }, [bookingId]);
    return <div className="container-shell grid min-h-[calc(100vh-10rem)] place-items-center py-12"><div className="w-full max-w-xl"><span className="section-kicker">Secure checkout</span><h1 className="mt-3 text-4xl font-black tracking-[-.05em]">Confirm your reservation</h1><p className="mt-3 text-sm leading-6 text-[var(--muted)]">Your payment secures your reservation request. The owner then approves or rejects the booking.</p>{error ? <div className="mt-7 rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">{error}</div> : !clientSecret || !stripe || !bookingId ? <LoadingState label="Preparing secure payment…"/> : <div className="mt-7"><Elements stripe={stripe} options={{ clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#176b52", borderRadius: "12px" } } }}><PaymentCheckout bookingId={bookingId} amount={amount}/></Elements><p className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-[var(--muted)]"><ShieldCheck size={15} className="text-[var(--brand)]"/>Your card details are encrypted by Stripe.</p></div>}</div></div>;
}
