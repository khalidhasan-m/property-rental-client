import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api/v1").replace(/\/api\/v1\/?$/, ""),
  fetchOptions: { credentials: "include" },
});

export const { useSession, signIn, signUp, signOut } = authClient;
