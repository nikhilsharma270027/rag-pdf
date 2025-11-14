import type { Metadata } from "next";
import { Button } from "../../../../src/components/ui/button";
import Link from "next/link";


export const metadata: Metadata = {
    title: "Email Verified"
}

export default function EmailVerifiedPage() {
    return (
        <div className="flex max-w-3xl mx-auto justify-center px-2 py-2 text-center items-center">
            <div className="space-y-4 ">
                <div className="space-y-2 ">
                    <h1 className="text-4xl font-instrument-serif font-light">Email verified</h1>
                    <p className="text-muted-foreground font-satoshi text-lg text-center">
                        Your email has been verified successfully.
                        <br />If you click the below button you will be redirected to dashboard
                    </p>
                </div>
                <Button asChild className="rounded-full font-satoshi">
                    <Link href="/dashboard">Go to dashboard</Link>
                </Button>
            </div>
        </div>

    )
}