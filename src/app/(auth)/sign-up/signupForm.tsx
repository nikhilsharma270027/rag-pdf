"use client"
import { passwordSchema } from "../../../lib/validations";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "../../../../src/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardDescription,
  CardTitle
} from "../../../../src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../src/components/ui/form";
import { Button } from "../../../../src/components/ui/button";
import { Input } from "../../../../src/components/ui/input";

const SignUpSchema = z
    .object({
        name: z.string().min(1, { message: "name is required" }),
        email: z.email({ message: "please enter a valid email address" }),
        password: passwordSchema,
        passwordConfirmation: z
            .string()
            .min(1, { message: "please enter valid password" })
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "password doesn&apos;t match",
        path: ["passwordConfirmation"]
    });

type SignUpValues = z.infer<typeof SignUpSchema>;

export default function SignUpForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const form = useForm<SignUpValues>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordConfirmation: ""
        }
    });

    async function onSubmit({ name, email, password }: SignUpValues) {
        form.clearErrors();
        setIsSubmitting(true);

        try {
            const { error: apiError } = await authClient.signUp.email({
                email,
                password,
                name,
                callbackURL: "/dashboard"
            });

            if (apiError) {
                form.setError("root", {
                    message: apiError.message
                        
                });
                return;
            }

            toast.success("Sign up successful");
            router.push("/dashboard");
        } catch (unexpectedError) {
            console.error("Sign-up request failed:", unexpectedError);
            form.setError("root", {
                message: "An unexpected error occurred. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const { formState } = form;

    return (
        <div>
            <div className="flex flex-col gap-1">
                <span className="text-4xl font-instrument-serif">
                    Welcome to better auth boilerplate
                </span>
                {/* Inserted between the div, not at the start */}
                <span className="font-satoshi text-[14px] text-center text-black ">
                    ~built with prisma, betterauth, shadcn, nextjs & react hook forms !
                </span>
            </div>
            
        <Card className="max-w-full min-w-[24rem] mx-auto mt-8">
            <CardHeader className="text-center">
                <CardTitle className="font-instrument-serif text-lg md:text-2xl">
                    SignUp
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">Please Create a new Account</CardDescription>
            </CardHeader>
             <CardContent>
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter your name"
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
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
                            name="passwordConfirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Confirm Password"
                                            className="rounded-xl"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {formState.errors.root && (
                            <div className="text-red-500 text-sm">{formState.errors.root.message}</div>
                        )}
                        <Button
                            type="submit"
                            className="w-full rounded-2xl py-2 px-4 mt-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Signing up..." : "Sign Up"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <div className="flex w-full justify-center border-t pt-4">
                    <p className="text-muted-foreground text-center text-xs">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </CardFooter>
        </Card>
        </div>
    );
}