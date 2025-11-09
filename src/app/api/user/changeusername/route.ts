import { getServerSession } from "@/lib/get-session"
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const session = await getServerSession();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name } = await request.json(); 

        // Validate the name
        if (!name || name.trim().length === 0) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        if (name.length > 50) {
            return NextResponse.json({ error: 'Name is too long' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: name.trim() 
            }
        })

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error changing username:', error);
        return NextResponse.json({ error: 'Failed to change username' }, { status: 500 });
    }
}