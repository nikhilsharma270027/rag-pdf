import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, lastLoginMethodClient } from "better-auth/client/plugins";
import { auth as serverAuth } from "./auth";

export const authClient = createAuthClient({
    plugins: [nextCookies(), inferAdditionalFields<typeof serverAuth>(), lastLoginMethodClient()]
})

export const auth = authClient;