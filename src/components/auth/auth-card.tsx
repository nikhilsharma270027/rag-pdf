"use client"

import { useState } from "react"
import Link from "next/link"

import { cn } from "../../../src/lib/utils"
import { authClient } from "../../../src/lib/auth-client"
import { Icons } from "../../../src/components/icons"

import { Button } from "../../../src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../src/components/ui/card"

// Type definitions for component props
interface AuthCardProps {
  title: string
  description: string
  mode?: "sign-in" | "sign-up"
}

interface SignInButtonProps {
  title: string
  provider: "github" | "google" | "discord"
  loading: boolean
  setLoading: (loading: boolean) => void
  callbackURL: string
  icon: React.ReactNode
}

/**
 * Authentication card component that provides social login options
 */
export function AuthCard({
  title,
  description,
  mode = "sign-in",
}: AuthCardProps) {
  // Track loading state for each provider
  const [githubLoading, setGithubLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [discordLoading, setDiscordLoading] = useState(false)

  return (
    <Card className="max-w-md w-full rounded-xl border-dashed shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-center">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <SignInButton
              title="Continue with Github"
              provider="github"
              loading={githubLoading}
              setLoading={setGithubLoading}
              callbackURL="/dashboard"
              icon={<Icons.Github className="mr-2 h-5 w-5" />}
            />
            
            <SignInButton
              title="Continue with Google"
              provider="google"
              loading={googleLoading}
              setLoading={setGoogleLoading}
              callbackURL="/dashboard"
              icon={<Icons.Google className="mr-2 h-5 w-5" />}
            />
            
            <SignInButton
              title="Continue with Discord"
              provider="discord"
              loading={discordLoading}
              setLoading={setDiscordLoading}
              callbackURL="/dashboard"
              icon={<Icons.Discord className="mr-2 h-5 w-5" />}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t border-dashed pt-4">
        <p className="text-sm text-muted-foreground">
          {mode === "sign-in" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  )
}

/**
 * Button component for social authentication
 */
function SignInButton({
  title,
  provider,
  loading,
  setLoading,
  callbackURL,
  icon,
}: SignInButtonProps) {
  const handleSignIn = async () => {
    try {
      setLoading(true)
      await authClient.signIn.social({
        provider,
        callbackURL,
      })
    } catch (error) {
      console.error(`${provider} sign-in error:`, error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className={cn(
        "w-full relative h-11 rounded-lg",
        "border-dashed transition-all duration-200",
        "hover:bg-muted/50 flex items-center justify-center",
        loading && "opacity-70 cursor-not-allowed"
      )}
      disabled={loading}
      onClick={handleSignIn}
    >
      {loading ? (
        <Icons.Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        icon
      )}
      <span>{title}</span>
    </Button>
  )
}

export default AuthCard