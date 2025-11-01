import type { Metadata } from "next";
import SignUpForm from "./signupForm";

export const metadata: Metadata = {
    title: "Sign Up"
}

export default function SignIn() {
    return (
        <div className="max-w-7xl mx-auto flex items-center justify-center px-4 min-h-svh">
            <SignUpForm />
        </div>
    )
}