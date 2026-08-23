"use client";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api, getApiErrorMessage } from "@/lib/api";
export function PaymentCheckout({ bookingId, amount }) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const submit = async (event) => { event.preventDefault(); if (!stripe || !elements)
        return; const { error, paymentIntent } = await stripe.confirmPayment({ elements, redirect: "if_required" }); if (error)
        return toast.error(error.message || "Payment failed"); if (!paymentIntent || paymentIntent.status !== "succeeded")
        return toast.error("Payment is not complete yet"); try {
        await api.post("/bookings/confirm-payment", { bookingId, paymentIntentId: paymentIntent.id });
        toast.success("Payment confirmed");
        router.push(`/booking-success?bookingId=${bookingId}`);
    }
    catch (requestError) {
        toast.error(getApiErrorMessage(requestError));
    } };
    return <form onSubmit={submit} className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6"><div className="mb-5 flex items-center justify-between"><div><p className="font-black">Reservation payment</p><p className="text-sm text-[var(--muted)]">Securely processed by Stripe</p></div><p className="text-xl font-black text-[var(--brand)]">${amount.toLocaleString()}</p></div><PaymentElement options={{ layout: "tabs" }}/><Button type="submit" isDisabled={!stripe} className="mt-6 w-full bg-[var(--brand)] font-black text-white">Pay ${amount.toLocaleString()}</Button></form>;
}
