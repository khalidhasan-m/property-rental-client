import axios from "axios";
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});
export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || fallback;
    }
    return fallback;
}
