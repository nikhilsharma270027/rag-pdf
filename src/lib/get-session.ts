import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";

export const getServerSession = cache(async () => {
  console.log("getServerSession");
  return await auth.api.getSession({ headers: await headers() });
});

// Example function for email sign-in (not called directly)
export async function signInEmailExample(email: string, password: string) {
  return await auth.api.signInEmail({
    body: {
      email,
      password
    },
    asResponse: true
  });
}