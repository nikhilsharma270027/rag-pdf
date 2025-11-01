import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from './prisma';
import { sendEmail } from './email'
import { APIError, createAuthMiddleware } from "better-auth/api";
import { passwordSchema } from './validations';
import { lastLoginMethod } from "better-auth/plugins"

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET || "CHANGE_THIS_SECRET_IN_PRODUCTION",
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    // Configure social providers with proper error handling
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      // Use consistent redirectURI format
      redirectURI: process.env.NODE_ENV === "production" 
        ? `${process.env.BETTER_AUTH_URL || ""}/api/auth/callback/google`
        : "https://athubetterauth.vercel.app/api/auth/callback/google",
    },
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID || "",
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    //   enabled: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    //   // Use consistent redirectURI format
    //   redirectURI: process.env.NODE_ENV === "production"
    //     ? `${process.env.BETTER_AUTH_URL || ""}/api/auth/callback/github`
    //     : "http://localhost:3000/api/auth/callback/github",
    // }
  },
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true, only if you want to block login completely
    async sendResetPassword({user, url}) {
      await sendEmail({
        to: user.email,
        subject: "Reset your Password",
        text: `Click the  following link to reset password ${url}`,
      })
      
    },
  },
  emailVerification: {
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({user, url}) {
      await sendEmail({
        to: user.email,
        subject: "Verify your email here",
        text: `Click here to verify your email ${url}`
      })
    }
  },
  user: {
    changeEmail: {
      enabled: true, 
      async sendChangeEmailVerification({user, newEmail, url}) {
        await sendEmail({
          to: user.email,
          subject: "Approve email change",
          text: `Your email has been changed to this new email ${newEmail}. Click the link to approve the change: ${url}`
        })
      },
    },
    additionalFields: {
      role: {
        type: "string",
        input: false,
      }
    }
  },
  plugins: [
    lastLoginMethod()
  ],
  hook: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === "/sign-up/email" ||
        ctx.path === "/reset-password" ||
        ctx.path === "/change-password"
      ) {
        const password = ctx.body.password || ctx.body.newPassword;
        const {error} = passwordSchema.safeParse(password)
        if(error) {
          throw new APIError("BAD_REQUEST", {
            message: "Password not strong enough",
          })
        }
      }
    }),
    afterSignIn: async ({user}: {user: {id: string}}) => {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      })
    }
  }
})

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;