import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api/v1",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});



export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
    if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const items = responseData?.issues || responseData?.errors;
        if (items && Array.isArray(items) && items.length > 0) {
            const first = items[0];
            const path = first.path ? (Array.isArray(first.path) ? first.path.join(".") : String(first.path)) : "";
            const msg = first.message || first.issue;
            if (path && msg) {
                return `${path}: ${msg}`;
            }
            if (msg) return msg;
        }
        return responseData?.message || fallback;
    }
    return fallback;
}
