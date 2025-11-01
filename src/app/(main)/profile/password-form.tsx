"use client"
import { passwordSchema } from "../../../../src/lib/validations"
import { useState } from "react"
import {z} from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "../../../../src/lib/auth-client";


const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, {message: "Current password is required"}),
    newPassword: passwordSchema
})//isme apan purana password lenge and new password jo bhii rakhna hai wo apne passwordSchema se match hona chahiye

type updatePasswordValues = z.infer<typeof updatePasswordSchema>

export function PasswordForm() {
    const [status, setStatus] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<updatePasswordValues>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
        }
    })

    async function onSubmit({currentPassword, newPassword}: updatePasswordValues) {
        setStatus(null)
        setError(null)
        setIsSubmitting(true)

        try {
            const {error} = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true
            })

            if(error) {
                setError(error.message || "Failed to change password")
            } else {
                setStatus("Password changed successfully")
                form.reset()
            }
        } catch (err) {
            setError("An unexpected error occurred")
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }
    
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg">
            <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm font-medium">
                    Current Password
                </label>
                <input
                    id="currentPassword"
                    type="password"
                    className="w-full p-2 border rounded-md"
                    {...form.register("currentPassword")}
                />
                {form.formState.errors.currentPassword && (
                    <p className="text-sm text-red-500">{form.formState.errors.currentPassword.message}</p>
                )}
            </div>
            
            <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                    New Password
                </label>
                <input
                    id="newPassword"
                    type="password"
                    className="w-full p-2 border rounded-md"
                    {...form.register("newPassword")}
                />
                {form.formState.errors.newPassword && (
                    <p className="text-sm text-red-500">{form.formState.errors.newPassword.message}</p>
                )}
            </div>
            
            {error && <p className="text-sm text-red-500">{error}</p>}
            {status && <p className="text-sm text-green-500">{status}</p>}
            
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
                {isSubmitting ? "Updating..." : "Update Password"}
            </button>
        </form>
    )
}