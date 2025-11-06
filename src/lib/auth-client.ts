import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, lastLoginMethodClient } from "better-auth/client/plugins";
import { auth as serverAuth } from "./auth";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
    fetchOptions:{
        credentials: "include",
        authorization: `Bearer ${process.env.BETTER_AUTH_API_KEY || ""}`,
    },
    plugins: [nextCookies(), inferAdditionalFields<typeof serverAuth>(), lastLoginMethodClient()]
})

export const { useSession } = authClient;
export const auth = authClient;