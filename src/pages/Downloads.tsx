import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/layout/Container';
import { AppLayout } from '@/components/ui/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NoteCard from '@/components/course/NoteCard';
import FilePreview from '@/components/course/FilePreview';
import { Note } from '@/types/course';
import { getDownloadedNotes, deleteDownloadedNote, deleteAllDownloadedNotes, isPWAMode, isIOSDevice } from '@/utils/downloadsManager';
import { useAuth } from '@/hooks/use-auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Downloads = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isPWA, setIsPWA] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setIsPWA(isPWAMode());
    setIsIOS(isIOSDevice());
  }, []);

  useEffect(() => {
    loadDownloadedNotes();
  }, [user?.id]);

  const loadDownloadedNotes = () => {
    setIsLoading(true);
    try {
      console.log("Loading downloaded notes for user:", user?.id);
      const downloadedNotes = getDownloadedNotes(user?.id);
      console.log("Downloaded notes:", downloadedNotes);
      
      const validNotes = downloadedNotes.filter(note => 
        note && note.id && note.title && note.fileUrl
      );
      
      setNotes(validNotes);
      
      if (isPWA && isIOS && validNotes.length > 0 && !selectedNote) {
        setSelectedNote(validNotes[0]);
      }
    } catch (error) {
      console.error("Error loading downloaded notes:", error);
      toast({
        title: "Error",
        description: "Failed to load downloaded notes",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    try {
      if (selectedNote && selectedNote.id === noteId) {
        setSelectedNote(null);
      }
      
      const success = deleteDownloadedNote(noteId, user?.id);
      if (success) {
        setNotes(notes.filter(note => note.id !== noteId));
        toast({
          title: "Success",
          description: "Note deleted successfully",
        });
      } else {
        throw new Error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAllNotes = () => {
    try {
      const success = deleteAllDownloadedNotes(user?.id);
      if (success) {
        setNotes([]);
        setSelectedNote(null);
        setDeleteAllDialogOpen(false);
        toast({
          title: "Success",
          description: "All notes deleted successfully",
        });
      } else {
        throw new Error("Failed to delete all notes");
      }
    } catch (error) {
      console.error("Error deleting all notes:", error);
      toast({
        title: "Error",
        description: "Failed to delete all notes",
        variant: "destructive"
      });
    }
  };

  const toggleFilePreview = (note: Note) => {
    setSelectedNote(selectedNote && selectedNote.id === note.id ? null : note);
  };

  return (
    <AppLayout title="Downloaded Notes">
      <Container className="py-6 space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold animate-slide-down">Downloaded Notes</h2>
            <p className="text-muted-foreground animate-slide-up">
              Access your offline materials
            </p>
          </div>
          
          {notes.length > 0 && (
            <Button 
              variant="destructive"
              onClick={() => setDeleteAllDialogOpen(true)}
              className="hidden sm:flex"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All
            </Button>
          )}
        </div>
        
        {notes.length > 0 && (
          <div className="sm:hidden">
            <Button 
              variant="destructive"
              onClick={() => setDeleteAllDialogOpen(true)}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All
            </Button>
          </div>
        )}
        
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {isLoading ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">Loading downloaded notes...</p>
            </div>
          ) : notes.length > 0 ? (
            <>
              {isPWA && isIOS ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div key={note.id} className="border rounded-lg overflow-hidden">
                        <div 
                          className={`cursor-pointer p-4 ${selectedNote?.id === note.id ? 'bg-primary/5 border-primary' : ''}`} 
                          onClick={() => toggleFilePreview(note)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium">{note.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">{note.description}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="ml-2"
                              onClick={() => toggleFilePreview(note)}
                            >
                              {selectedNote?.id === note.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center px-4 py-2 border-t bg-muted/10">
                          <span className="text-xs text-muted-foreground">
                            {new Date(note.uploadDate).toLocaleDateString('en-GB')}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(note.id)}
                            className="h-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedNote && (
                    <div className="sticky top-4 space-y-4">
                      <FilePreview note={selectedNote} />
                    </div>
                  )}
                </div>
              ) : (
                notes.map((note) => (
                  <NoteCard 
                    key={note.id} 
                    note={note} 
                    onDeleteNote={handleDeleteNote}
                    downloadView={true}
                    showRedirect={true}
                  />
                ))
              )}
            </>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">No downloaded notes available.</p>
              <p className="text-sm mt-2">Download notes from your courses to access them offline.</p>
            </div>
          )}
        </div>
      </Container>
      
      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Downloaded Notes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all downloaded notes? This will only remove them from your local device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAllNotes} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Downloads;
