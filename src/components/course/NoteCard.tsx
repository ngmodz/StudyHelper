
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Note } from '@/types/course';
import DeleteNoteDialog from './DeleteNoteDialog';
import { useToast } from '@/hooks/use-toast';
import { 
  saveNoteToStorage, 
  deleteDownloadedNote, 
  isNoteDownloaded, 
  downloadNoteWithRetry,
  isMobileDevice,
  isIOSDevice,
  isPWAMode,
  getCachedFile
} from '@/utils/downloadsManager';
import { useAuth } from '@/hooks/use-auth';
import NoteActions from './note/NoteActions';
import NoteHeader from './note/NoteHeader';
import NoteFooter from './note/NoteFooter';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface NoteCardProps {
  note: Note;
  className?: string;
  isTeacher?: boolean;
  onDeleteNote?: (noteId: string) => void;
  downloadView?: boolean;
  bookmarkView?: boolean;
  onRemoveBookmark?: (noteId: string) => void;
  showRedirect?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  className,
  isTeacher = false,
  onDeleteNote,
  downloadView = false,
  bookmarkView = false,
  onRemoveBookmark,
  showRedirect = false
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { user, toggleBookmark, isBookmarked } = useAuth();

  const safeNote = note ? { ...note } : null;
  const isValidNote = safeNote && safeNote.id && safeNote.title && safeNote.fileUrl;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    setIsPWA(isPWAMode());
    setIsIOS(isIOSDevice());
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isValidNote) {
      const downloaded = isNoteDownloaded(safeNote.id, user?.id);
      setIsDownloaded(downloaded);
    }
  }, [safeNote?.id, user?.id, isValidNote]);

  const handleDelete = (deleteFromDatabase = false) => {
    setDeleteDialogOpen(true);
    setPendingDeleteType(deleteFromDatabase ? 'db' : 'local');
  };

  const [pendingDeleteType, setPendingDeleteType] = useState<'db' | 'local'>(
    downloadView ? 'local' : 'db'
  );

  const confirmDelete = async () => {
    if (pendingDeleteType === 'local') {
      try {
        const success = deleteDownloadedNote(safeNote.id, user?.id);
        if (success) {
          setIsDownloaded(false);
          toast({
            title: "Deleted",
            description: "Downloaded note deleted successfully",
          });
          if (downloadView && onDeleteNote) {
            onDeleteNote(safeNote.id);
          }
        } else {
          throw new Error();
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete downloaded note",
          variant: "destructive"
        });
      } finally {
        setDeleteDialogOpen(false);
      }
    } else if (pendingDeleteType === 'db' && onDeleteNote) {
      try {
        await onDeleteNote(safeNote.id);
        toast({
          title: "Deleted",
          description: "Note deleted from database",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete note from database",
          variant: "destructive"
        });
      } finally {
        setDeleteDialogOpen(false);
      }
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    
    if (!isValidNote) {
      toast({
        title: "Error",
        description: "Cannot download note due to missing information",
        variant: "destructive"
      });
      return;
    }
    
    setIsDownloading(true);
    
    try {
      if (isIOS && isPWA) {
        toast({ 
          title: "Preparing file...", 
          description: "The file will be available in your Downloads section", 
        });
      } else if (isMobileDevice()) {
        const isIOS = isIOSDevice();
        toast({
          title: "Starting download...",
          description: isIOS 
            ? "Safari will open the file. Use the share button to save it."
            : "Check your download folder when complete",
        });
      }
      
      console.log("Attempting to download note:", safeNote);
      const success = await downloadNoteWithRetry(safeNote);
      
      if (success) {
        setIsDownloaded(true);
        if (isPWA && isIOS) {
          toast({ 
            title: "Downloaded Successfully", 
            description: "Go to Downloads section to view and save the file", 
          });
        } else if (!isIOSDevice()) {
          toast({
            title: "Success",
            description: isMobileDevice() 
              ? "Note has been downloaded to your downloads folder" 
              : "Note downloaded successfully",
          });
        }
      } else {
        throw new Error("Download failed");
      }
    } catch (error) {
      console.error("Download error:", error);
      
      let errorMessage = "Please try again or contact support if the issue persists";
      
      if (error instanceof Error) {
        if (error.message.includes("NetworkError") || 
            error.message.includes("network") ||
            error.message.includes("Failed to fetch")) {
          errorMessage = "Network error detected. Please check your internet connection and try again.";
        } else if (error.message.includes("AbortError") || 
                  error.message.includes("timeout")) {
          errorMessage = "Download request timed out. Please try again on a more stable connection.";
        } else if (error.message.includes("not found") || 
                  error.message.includes("404")) {
          errorMessage = "The file could not be found on the server. It may have been moved or deleted.";
        } else if (error.message.includes("Bucket not found")) {
          errorMessage = "Storage bucket not found. The file may not be accessible.";
        }
      }
      
      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveToFiles = async (e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    
    if (!isValidNote) {
      toast({
        title: "Error",
        description: "Cannot save note due to missing information",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (!isDownloaded) {
        await handleDownload(e);
      }
      const cachedFile = getCachedFile(safeNote.id);
      if (cachedFile) {
        const filename = `${safeNote.title.replace(/[^a-z0-9]/gi, '_')}.${safeNote.fileType}`;
        const file = new File([cachedFile.blob], filename, { type: cachedFile.type });
        const shareData = { files: [file], title: safeNote.title, text: `${safeNote.title} - ${safeNote.description}` };
        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
          toast({ title: "File Ready", description: "You can now save to Files app", });
        } else {
          toast({ title: "Not Supported", description: "Your browser doesn't support file sharing", variant: "destructive" });
        }
      } else {
        toast({ title: "File Error", description: "Please try downloading the file first", variant: "destructive" });
      }
    } catch (error) {
      console.error("Save to files error:", error); 
      toast({ title: "Save Error", description: "Could not save file to Files app", variant: "destructive" });
    }
  };

  const handleViewInPWA = (e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    window.location.href = '/downloads';
  };

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    
    if (!isValidNote) {
      toast({
        title: "Error", 
        description: "Cannot bookmark invalid note",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await toggleBookmark(safeNote.id);
      
      const isCurrentlyBookmarked = isBookmarked(safeNote.id);
      
      if (bookmarkView && !isCurrentlyBookmarked && onRemoveBookmark) {
        onRemoveBookmark(safeNote.id);
      }
      
      toast({
        title: isCurrentlyBookmarked ? "Added to bookmarks" : "Removed from bookmarks",
        description: isCurrentlyBookmarked
          ? "Note has been added to your bookmarks" 
          : "Note has been removed from your bookmarks",
      });
    } catch (error) {
      console.error("Bookmark error:", error);
      toast({
        title: "Bookmark error",
        description: "Could not update bookmark status",
        variant: "destructive"
      });
    }
  };

  const noteIsBookmarked = isBookmarked(safeNote?.id || '');

  if (!isValidNote) {
    return (
      <div className={cn('card-container bg-card/50 border-border/40 rounded-lg overflow-hidden mb-4', className)}>
        <div className="p-4">
          <Alert variant="destructive">
            <AlertTitle>Invalid Note</AlertTitle>
            <AlertDescription>This note is missing required information and cannot be displayed properly.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn('card-container bg-card/50 border-border/40 rounded-lg overflow-hidden mb-4', className)}>
        <div className="p-4">
          <NoteHeader 
            title={safeNote.title}
            description={safeNote.description}
            isBookmarked={noteIsBookmarked}
            onToggleBookmark={handleToggleBookmark}
          />
          <NoteActions 
            note={safeNote}
            isDownloading={isDownloading}
            isDownloaded={isDownloaded}
            isPWA={isPWA}
            isMobileDevice={isMobileDevice()}
            downloadView={downloadView}
            bookmarkView={bookmarkView}
            isTeacher={isTeacher}
            showRedirect={showRedirect || downloadView}
            handleDownload={handleDownload}
            handleSaveToFiles={handleSaveToFiles}
            handleViewInPWA={handleViewInPWA}
            handleDeleteDownloaded={e => handleDelete(false)}
            handleDeleteFromDatabase={() => handleDelete(true)}
            handleToggleBookmark={handleToggleBookmark}
          />
          <NoteFooter 
            uploadDate={safeNote.uploadDate}
            fileType={safeNote.fileType}
          />
        </div>
      </div>

      <DeleteNoteDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        noteTitle={safeNote.title}
        isDownloadedNote={pendingDeleteType === 'local' || downloadView}
      />
    </>
  );
};

export default NoteCard;
