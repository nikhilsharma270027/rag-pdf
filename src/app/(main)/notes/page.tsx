"use client";
import { useSession } from "@/lib/auth-client";
import { LoaderPinwheelIcon, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Player } from "@lottiefiles/react-lottie-player";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotesList from "@/components/notes/NotesList";
import { Button } from "@/components/ui/button";
import NotesEditor from "@/components/notes/NotesEditor";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  parentId: string | null;
}
interface NoteData {
  id: string;
  title: string;
  blocks: Array<{ type: string; content: string; checked?: boolean }>;
  createdAt: string;
  parentId?: string | null;
}

export default function NotesPage() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<NoteData[]>([]);
  // so to handle which note is selected
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false); // to handle new note creation state
  const [loading, setLoading] = useState(false); // to handle loading state

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notes");
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data = await response.json();
      console.log("Fetched Notes Data:", data);
      // convert content array to string
      const formattedNotes: any = data.map((note: NoteData) => ({
        ...note,
        content: Array.isArray(note.blocks) ? note.blocks[0]?.content || "" : note.blocks || "",
      }));
      console.log("Formatted Notes:", formattedNotes);

      setNotes(formattedNotes);
    } catch (error) {
      console.log("Error fetching notes:", error);
      toast.error("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes, session]);

  const createNewNote = async () => {
    toast.info("Creating a new note...", { duration: 800 });
    setIsCreating(true);
    setSelectedNote(null); // Deselect any selected note
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <Player
          autoplay
          loop
          src="https://assets2.lottiefiles.com/packages/lf20_qg4cSS.json"
          style={{ height: "200px", width: "200px" }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* notes page name and new notes quick access */}

      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <div className="text-base sm:text-2xl md:text-3xl font-bold">Notes</div>
        <div className="flex gap-2">
          {/* <Button  */}
          {/* className="md:hidden " */}
          {/* // onClick={() => setShowSidebar(!showSidebar)} */}
          {/* variant="outline" */}
          {/* > */}
          {/* {showSidebar ? 'Hide Notes' : 'Show Notes'} */}
          {/* </Button> */}
          <Button
            variant={"default"}
            onClick={createNewNote}
            className="
                border-2 
                border-black 
                border-b-4 
                border-r-4 
                hover:border-black 
                hover:bg-black 
                hover:text-white 
                hover:scale-105
                active:scale-95
                active:border-b-2
                active:border-r-2
                active:translate-y-0.5
                transform
                transition-all 
                duration-150
                ease-in-out
              ">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">New Note</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        <div className="md:col-span-3 lg:col-span-3 bg-amber-50 rounded-lg">
          <Card className="h-[calc(100vh-16rem)] md:h-[calc(100vh-12rem)] overflow-y-auto border-2 border-black rounded-lg">
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-2xl sm:teext-xl font-semibold"> Your Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              <NotesList
                notes={notes}
                selectedNote={selectedNote}
                onSelectNote={(note: Note) => {
                  setSelectedNote(note);
                }}
                onRefresh={fetchNotes}
              />
            </CardContent>
          </Card>
        </div>
        {/* todo editor here */}
        <div className="md:col-span-9 bg-amber-50 rounded-lg">
          <Card className="h-[calc(100vh-16rem)] md:h-[calc(100vh-12rem)] overflow-y-auto border-2 border-black rounded-lg">
            <CardContent className="p-3 sm:p-4">
              {isCreating ||selectedNote ? (
                <div>
                  <NotesEditor
                    note={selectedNote}
                    onSave={async () => {
                      await fetchNotes();
                      setIsCreating(false);
                    }}
                    onCancel={() => {
                      setIsCreating(false);
                      setSelectedNote(null);
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="text-2xl font-semibold mb-4">Select a note to edit</h2>
                  <p className="text-muted-foreground">Choose a note from the list on the left to view and edit its content.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// {/* <h1>Notes Page</h1>
// {session ? (
//     <p>Welcome back, {session.user.name}!</p>
// ) : (
//     <p>Please log in to view your notes.</p>
// )} */}
