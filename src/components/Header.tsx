
import SignIn from "@/app/(auth)/sign-in/page";
import { getServerSession } from "@/lib/get-session";
import Link from "next/link";
import { Button } from "./ui/button";
// import { useEffect } from "react";
import { router } from "better-auth/api";
// import { useRouter } from "next/navigation";

export default async function Header() {
  // const router = useRouter();
  const session = await getServerSession();
  const user = session?.user;

  // useEffect(() => {
  //   console.log("Header session:", session);
  //   if(!session) {
  //     console.log("User is not signed in");
  //     // move to dashboard
  //     router.push("/sign-in");
  //   } else {
  //     // move to dashboard
  //     console.log("User is signed in:", session.user);
  //     router.push("/dashboard");
  //   }

  // }, [session]);
  

  return (
    <header className="fixed top-5 left-0 right-0 z-50 bg-transparent backdrop-blur-sm border-b-2 h-14">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-2">
          {/* logo and title */}
          <div className="flex items-center gap-2">
            <Link href={session ? "/dashboard" : "/"}>
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#c1ff72] rounded-sm flex items-center justify-center border-2 border-b-3 border-r-3 border-black">
                <span className="text-black text-base sm:text-xl">🎓</span>
              </div>
            </Link>
              <span className="font-semibold lg:text-2xl sm:text-base">Rag-Pdf</span>
              <span className="font-semibold text-sm sm:text-base">{user?.name}</span>
          </div>

          {/* links */}
          <div>
            {!session && (
              <div className="flex gap-1 sm:gap-2">
                <Link href="/sign-in" passHref>
                <Button
                  variant="outline"
                //   onClick={() => signIn()}
                  className="bg-[#c1ff72] border-2 border-black text-xs sm:text-sm px-2 sm:px-4 cursor-pointer"
                  >
                  Sign In
                </Button>
                </Link>
                <Link href="/sign-up" passHref>
                  <button className="px-2 sm:px-4 py-1.5 bg-[#c1ff72] border-2 border-b-4 border-r-4 border-black rounded-lg hover:bg-[#c1ff72] hover:border-b-2 hover:border-r-2 transition-all duration-100 text-xs sm:text-sm font-medium shadow-sm hover:shadow active:border-b-2 active:border-r-2">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
