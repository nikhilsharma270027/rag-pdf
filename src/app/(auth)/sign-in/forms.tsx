"use client"

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail, Github } from "lucide-react";
import { Badge } from "../../../../src/components/ui/badge"
import { authClient } from "../../../../src/lib/auth-client";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter
} from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Input } from "../../../../src/components/ui/input";
import { Checkbox } from "../../../../src/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../src/components/ui/form";


const signInSchema = z.object({
    email: z.email({message: "Please enter a valid email address"}),
    password: z.string().min(1, {message: "Password is required"}),
    rememberMe: z.boolean().optional()

})

type SignInValues = z.infer<typeof signInSchema>


export default function SignInForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [socialLoading, setSocialLoading] = useState<{
      google: boolean;
      github: boolean;
    }>({
      google: false,
      github: false
    });
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");
    // Get last login method
    const lastMethod = authClient.getLastUsedLoginMethod()

    const form = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false
        }
    })
    async function onSubmit({email, password, rememberMe}: SignInValues) {
        form.clearErrors();
        setIsSubmitting(true);
        
        try {
            const {error: apiError} = await authClient.signIn.email({
                email,
                password,
                rememberMe
            });

            if(apiError) {
                form.setError("root", { 
                    message: apiError.message || "Authentication failed" 
                });
                return;
            }
            
            toast.success("Signed in Successfully");
            router.push(redirect ?? "/dashboard");
        } catch (unexpectedError) {
            console.error("Sign-in request failed:", unexpectedError);
            form.setError("root", { 
                message: "An unexpected error occurred. Please try again." 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    async function handleSocialSignIn(provider: "google" | "github") {
        form.clearErrors();
        
        setSocialLoading(prev => ({
          ...prev,
          [provider]: true
        }));
        
        try {
            // First check if the provider is available
            const response = await fetch("/api/auth/providers");
            const availableProviders = await response.json();
            
            if (!availableProviders.includes(provider)) {
                toast.error(`${provider} login is not configured on the server`);
                form.setError("root", { 
                    message: `${provider} is not available. Please use email login or contact the administrator.` 
                });
                return;
            }
            
            // Try to sign in with the provider
            try {
                const { error: apiError } = await authClient.signIn.social({
                    provider,
                    callbackURL: redirect ?? "/dashboard"
                });
    
                if(apiError) {
                    // Handle specific error types
                    const errorCode = typeof apiError === 'object' ? apiError.code : undefined;
                    const errorMessage = typeof apiError === 'object' ? apiError.message : String(apiError);
                    
                    if (errorCode === "PROVIDER_NOT_FOUND") {
                        toast.error(`${provider} provider is not properly configured`);
                        form.setError("root", { 
                            message: `${provider} login is not available. Please use email login.` 
                        });
                    } else {
                        toast.error(`${provider} sign-in failed`);
                        form.setError("root", { 
                            message: errorMessage || `${provider} sign-in failed` 
                        });
                    }
                }
            } catch (socialError) {
                toast.error(`${provider} authentication error`);
                form.setError("root", { 
                    message: `${provider} authentication failed. Please try again later.` 
                });
            }
        } catch (unexpectedError) {
            toast.error(`Could not connect to authentication service`);
            form.setError("root", { 
                message: `${provider} sign-in error. Please try again or use email login.` 
            });
        } finally {
            // Reset loading state only for the specific provider
            setSocialLoading(prev => ({
              ...prev,
              [provider]: false
            }));
        }
    }

    const { formState } = form;
    
    return (
        <Card className="max-w-full min-w-[24rem] mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="md:text-2xl font-instrument-serif text-lg">Sign In</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      className="rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline"
                      prefetch={true}
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      placeholder="Password"
                       className="rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 justify-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      
                    />
                  </FormControl>
                  <FormLabel>Remember me</FormLabel>
                </FormItem>
              )}
            />

            {formState.errors.root && (
              <div role="alert" className="text-sm text-red-600">
                {formState.errors.root.message}
              </div>
            )}

            <Button type="submit" className="w-full rounded-2xl py-2 px-4" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
            </Button>

            <div className="flex w-full mx-auto flex-col items-center justify-between gap-2">
              <Button
                type="button"
                variant={lastMethod === "google" ? "default" : "outline"}
                className="w-full rounded-2xl relative py-2 px-4 flex items-center justify-center"
                disabled={socialLoading.google}
                onClick={() => handleSocialSignIn("google")}
              >
                <Mail className="w-4 h-4 mr-2" />
                <span>{socialLoading.google ? "Signing in..." : "Sign in with Google"}</span>
                {lastMethod === "google" && !socialLoading.google && (
                  <Badge className="font-satoshi" variant="secondary">Last used</Badge>
                )}
              </Button>

              <Button
                type="button"
                variant={lastMethod === "github" ? "default" : "outline"}
                className="w-full rounded-2xl relative py-2 px-4 flex items-center justify-center"
                disabled={socialLoading.github}
                onClick={() => handleSocialSignIn("github")}
              >
                <Github className="w-4 h-4 mr-2" />
                <span>{socialLoading.github ? "Signing in..." : "Sign in with Github"}</span>
                {lastMethod === "github" && !socialLoading.github && (
                  <Badge className="font-satoshi" variant="secondary">Last used</Badge>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-center border-t pt-4">
          <p className="text-muted-foreground text-center text-xs">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
    );
}