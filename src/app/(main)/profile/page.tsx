
import { getServerSession } from "../../../../src/lib/get-session";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { PasswordForm } from "./password-form";

export const metadata: Metadata = {
  title: "Profile"
};

export default async function ProfilePage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect("/sign-in");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Account Information</h2>
          <div className="p-4 border rounded-lg">
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user.name || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
                {!user.emailVerified && (
                  <p className="text-sm text-red-500 mt-1">Email not verified</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Security</h2>
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}
