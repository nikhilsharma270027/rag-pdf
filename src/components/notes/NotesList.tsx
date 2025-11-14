"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function NotesList({
  notes,
  onSelectNote,
  selectedNote,
  onRefresh,
}: {
  notes: any[];
  onSelectNote: (note: any) => void;
  selectedNote: any;
  onRefresh: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async (noteId: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      toast.success("Note deleted successfully");
      onRefresh();
    } catch (error) {
      console.log("Error deleting note:", error);
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
      // onRefresh();
    }
  };

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Player
          autoplay
          loop
          src="https://assets10.lottiefiles.com/packages/lf20_jtbfg2nb.json"
          style={{ height: "150px", width: "150px" }}></Player>
        <p className="text-black mt-4">No notes available. Create a new note to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Render list of notes here */}
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelectNote(note)}
          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-[#F5F1EA] ${
            selectedNote?.id === note.id ? "bg-[#F5F1EA] border-2" : ""
          }`}>
          <div>
            <div className="text-base sm:text-base md:text-lg font-semibold text-black">{note.title}</div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()} disabled={isDeleting}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-red-600 hover:text-red-800"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(note.id);
                }}
                disabled={isDeleting}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}
