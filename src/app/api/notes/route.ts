import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const parentId = searchParams.get("parentId") || null;

        // Fetch notes from your data source based on the user ID and parentId
        const notes = await prisma.note.findMany({
            where: {
                userId: session.user.id,
                parentId: parentId,
                isArchived: false,
            },
            orderBy: { createdAt: 'desc' },
            include: { blocks: true }, // Include blocks in the response
        })

        return NextResponse.json(notes);
    } catch (error) {
        console.log("Error fetching notes:", error);
        return new NextResponse("Failed to fetch notes", { status: 500 });
    }
}


/// create a new note
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        // willl create a new note in the database
        // Create a new note in the database
        const newNote = await prisma.note.create({
            data: {
                userId: session.user.id,
                title: data.title || "Untitled Note",
                // Handle blocks creation
                blocks: data.blocks ? {
                    create: data.blocks.map((block: any) => ({
                        type: block.type || 'paragraph',
                        content: block.content || '',
                        checked: block.checked || false,
                    }))
                } : undefined,
                parentId: data.parentId || null,
            },
            include: {
                blocks: true, // Include blocks in the response
            },
        });

        return NextResponse.json({ note: newNote }, { status: 201 });

    } catch (error) {
        console.log("Error creating note:", error);
        return new NextResponse("Failed to create note", { status: 500 });
    }
}