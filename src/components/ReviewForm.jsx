"use client";
import { useState } from "react";
import { Button, Textarea } from "@heroui/react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { api, getApiErrorMessage } from "@/lib/api";
export function ReviewForm({ propertyId, onReviewAdded, initialRating = 5, initialComment = "" }) {
    const [rating, setRating] = useState(initialRating);
    const [comment, setComment] = useState(initialComment);
    const [saving, setSaving] = useState(false);
    const submit = async (event) => { event.preventDefault(); if (comment.trim().length < 3)
        return toast.error("Write at least three characters for your review"); setSaving(true); try {
        await api.post("/reviews", { propertyId, rating, comment });
        toast.success("Your review was saved");
        setComment("");
        if (onReviewAdded) onReviewAdded();
    }
    catch (error) {
        toast.error(getApiErrorMessage(error));
    }
    finally {
        setSaving(false);
    } };
    return <form onSubmit={submit} className="mt-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5"><p className="font-black">Leave a review</p><div className="mt-3 flex gap-1">{Array.from({ length: 5 }, (_, index) => <button key={index} type="button" aria-label={`Rate ${index + 1} out of 5`} onClick={() => setRating(index + 1)} className="text-amber-400"><Star size={22} fill={index < rating ? "currentColor" : "none"}/></button>)}</div><Textarea className="mt-3" label="Your experience" value={comment} onValueChange={setComment} minRows={3}/><Button type="submit" isLoading={saving} className="mt-3 bg-[var(--brand)] font-bold text-white">Save review</Button></form>;
}
