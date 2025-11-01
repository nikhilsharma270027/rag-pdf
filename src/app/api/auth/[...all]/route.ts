import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "../../../../lib/auth";
import { NextResponse } from "next/server";

// Create handler without additional logging
const handler = toNextJsHandler(auth);

export const POST = async (req: Request) => {
  try {
    // Check if this is a social login request
    if (req.url.includes("/sign-in/social")) {
      try {
        // For social login, check provider configuration
        const body = await req.clone().json().catch(() => ({}));
        const provider = body?.provider?.toLowerCase();
        
        if (!provider) {
          return NextResponse.json(
            { error: "Missing provider parameter" },
            { status: 400 }
          );
        }
        
        // Check if provider credentials are configured
        const clientIdEnv = `${provider.toUpperCase()}_CLIENT_ID`;
        const clientSecretEnv = `${provider.toUpperCase()}_CLIENT_SECRET`;
        
        const hasClientId = !!process.env[clientIdEnv];
        const hasClientSecret = !!process.env[clientSecretEnv];
        
        // If credentials are missing, return a clear error
        if (!hasClientId || !hasClientSecret) {
          return NextResponse.json(
            { 
              error: "Provider not configured",
              code: "PROVIDER_NOT_FOUND",
              message: `${provider} login is not properly configured on the server`
            },
            { status: 400 }
          );
        }
      } catch (parseError) {
        // Silent catch - continue with handler
      }
    }
    
    return await handler.POST(req);
  } catch (error: any) {
    // Return error information without logging
    return NextResponse.json(
      { 
        error: "Authentication service error",
        message: error.message || "Unknown error",
        code: error.code || "INTERNAL_ERROR"
      },
      { status: 500 }
    );
  }
};

export const GET = async (req: Request) => {
  try {
    return await handler.GET(req);
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: "Authentication service error",
        message: error.message || "Unknown error" 
      },
      { status: 500 }
    );
  }
};