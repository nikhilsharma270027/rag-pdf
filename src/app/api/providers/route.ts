import { NextResponse } from "next/server";


export async function GET() {
  try {
    // Check which providers are actually configured
    const providers = [];
    
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      providers.push("google");
    }
    
    if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
      providers.push("github");
    }
    
    return NextResponse.json(providers);
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json([], { status: 500 });
  }
}