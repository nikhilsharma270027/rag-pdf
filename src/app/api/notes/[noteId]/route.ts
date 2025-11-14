import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { noteId: string } }) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const note = await prisma.note.findUnique({
            where: {
                id: params.noteId,
                userId: session.user.id,
            }
        });

        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        return NextResponse.json(note);

    } catch (error) {
        console.error("Error fetching note:", error);
        return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ noteId: string }> }
) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Await the params Promise
        const { noteId } = await params;
        const data = await request.json();

        console.log("Received data:", data); // Debug what's being sent

        // First check if note exists
        const existingNote = await prisma.note.findUnique({
            where: {
                id: noteId,
                userId: session.user.id,
            }
        });

        if (!existingNote) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        // Update only the fields that are provided
        const updateData: any = {
            title: data.title,
            updatedAt: new Date(),
        };

        // Only update blocks if blocks data is provided
        if (data.blocks) {
            updateData.blocks = {
                deleteMany: {},
                create: data.blocks.map((block: any) => ({
                    type: block.type || 'paragraph',
                    content: block.content || '',
                    checked: block.checked || false,
                }))
            };
        } else if (data.content) {
            // If content is provided but not blocks, create a default block
            updateData.blocks = {
                deleteMany: {},
                create: [{
                    type: 'paragraph',
                    content: data.content,
                    checked: false,
                }]
            };
        }

        const updatedNote = await prisma.note.update({
            where: {
                id: noteId,
                userId: session.user.id,
            },
            data: updateData,
            include: {
                blocks: true,
            },
        });

        return NextResponse.json(updatedNote);
    } catch (error) {
        console.error("Error updating note:", error);
        return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
    }
}



export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ noteId: string }> } // params is a Promise
) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Await the params Promise
        const { noteId } = await params;

        // Delete directly - Prisma will throw if note doesn't exist
        await prisma.note.delete({
            where: {
                id: noteId, // Use the awaited noteId
                userId: session.user.id,
            }
        });

        return NextResponse.json({ message: "Note deleted successfully" });
    } catch (error: any) {
        if (error.code === 'P2025') {
            // Record not found
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        console.error("Error deleting note:", error);
        return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
    }
}