"use client";

import { Button } from "../../../src/components/ui/button";
import { auth } from "../../../src/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.refresh();
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleSignOut}
      className="font-satoshi"
    >
      Sign Out
    </Button>
  );
}