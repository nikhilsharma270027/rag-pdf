import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../src/components/ui/card";
import { User } from "../../../../src/lib/auth";
import { getServerSession } from "../../../../src/lib/get-session";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignOutButton } from "../../../../src/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { signOut } from "better-auth/api";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Dashboard() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect("/sign-in");

  return (
    <div className="mx-auto w-full max-w-6xl px-1 py-2 border border-dashed border-black/40 h-screen">
      <ProfileInformation user={user} />
    </div>
  );
}

interface ProfileInformationProps {
  user: User;
}

function ProfileInformation({ user }: ProfileInformationProps) {
  return (
    <div className="flex flex-col justify-center items-center mx-auto">
      <div className="flex w-full justify-end ">
        <button onClick={() => signOut({ callbackUrl: "/sign-in", redirect: true })}>Sign Out</button>
      </div>
      <Card className="mt-20">
        <CardHeader>
          <CardTitle className="font-instrument-serif font-light justify-center md:text-4xl text-xl text-center flex items-center ">
            Welcome, You are Authenticated!
          </CardTitle>
          <CardDescription className="font-satoshi md:text-lg text-md hover:text-foreground text-center">
            This is protected dashboard only for users who are logged in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center font-satoshi md:text-md text-sm">
            This is the card where you will see basic details as who logged in so you&apos;re,{" "}
            <span className="relative inline-block">
              <span className="relative z-10 font-bold px-1 text-amber-900">{user.name}</span>
              <span className="absolute -inset-0.5 bg-amber-200 skew-x-12 transform " aria-hidden="true"></span>
            </span>{" "}
            right?
          </div>
          <div className="text-sm text-center md:text-md font-satoshi py-2">
            your mail is{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent font-bold px-1">
                {user.email}
              </span>
              <span className="absolute -inset-1 -skew-y-3 bg-primary/20 rounded-lg" aria-hidden="true"></span>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmailVerificationAlert() {
  return (
    <div className="">
      {/* 
            here we will add a line please verify your email address to see and will add one button with link tag redirect to /verify-email */}
    </div>
  );
}
