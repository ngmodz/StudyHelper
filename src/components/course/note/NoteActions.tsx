
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Check, Save, Eye, Trash2, BookmarkX, ExternalLink } from 'lucide-react';
import { Note } from '@/types/course';
import { Link } from 'react-router-dom';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface NoteActionsProps {
  note: Note;
  isDownloading: boolean;
  isDownloaded: boolean;
  isPWA: boolean;
  isMobileDevice: boolean;
  downloadView: boolean;
  bookmarkView: boolean;
  isTeacher: boolean;
  showRedirect?: boolean;
  handleDownload: (e: React.MouseEvent) => void;
  handleSaveToFiles: (e: React.MouseEvent) => void;
  handleViewInPWA: (e: React.MouseEvent) => void;
  handleDeleteDownloaded: (e: React.MouseEvent) => void;
  handleDeleteFromDatabase: () => void;
  handleToggleBookmark: (e: React.MouseEvent) => void;
}

export const NoteActions: React.FC<NoteActionsProps> = ({
  note,
  isDownloading,
  isDownloaded,
  isPWA,
  isMobileDevice,
  downloadView,
  bookmarkView,
  isTeacher,
  showRedirect,
  handleDownload,
  handleSaveToFiles,
  handleViewInPWA,
  handleDeleteDownloaded,
  handleDeleteFromDatabase,
  handleToggleBookmark
}) => {
  // Validate note before rendering
  if (!note || !note.fileUrl) {
    return (
      <Alert variant="destructive" className="mt-3">
        <AlertTitle>Invalid note</AlertTitle>
        <AlertDescription>This note cannot be downloaded due to missing file data.</AlertDescription>
      </Alert>
    );
  }
  
  // Verify if the URL is properly encoded
  const getValidFileUrl = () => {
    try {
      // Check if the URL is valid
      new URL(note.fileUrl);
      return true;
    } catch (error) {
      console.error("Invalid URL:", note.fileUrl, error);
      return false;
    }
  };

  // If URL is invalid, show error
  if (!getValidFileUrl()) {
    return (
      <Alert variant="destructive" className="mt-3">
        <AlertTitle>Invalid URL</AlertTitle>
        <AlertDescription>This note has an invalid download URL.</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="flex flex-col gap-2 mt-3 sm:flex-row sm:flex-wrap">
      {!downloadView && !isDownloaded ? (
        <>
          <Button 
            size="default" 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground hover-lift"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⟳</span>
                Downloading...
              </span>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download
              </>
            )}
          </Button>
          
          {(isMobileDevice || isPWA) && (
            <Button 
              size="default" 
              variant="outline" 
              className="w-full sm:w-auto hover-lift"
              onClick={handleSaveToFiles}
              disabled={isDownloading}
            >
              <Save className="h-4 w-4 mr-2" />
              Save to Files
            </Button>
          )}
        </>
      ) : !downloadView && isDownloaded ? (
        <>
          <Button 
            size="default" 
            variant="outline" 
            className="w-full sm:w-auto bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-800/30"
            disabled
          >
            <Check className="h-4 w-4 mr-2" />
            Downloaded
          </Button>
          
          {isMobileDevice && (
            <Button 
              variant="outline" 
              size="default" 
              className="w-full sm:w-auto hover-lift"
              onClick={handleSaveToFiles}
            >
              <Save className="h-4 w-4 mr-2" />
              Save to Files
            </Button>
          )}
          
          {isPWA && (
            <Button 
              variant="outline" 
              size="default" 
              className="w-full sm:w-auto hover-lift"
              onClick={handleViewInPWA}
            >
              <Eye className="h-4 w-4 mr-2" />
              View File
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="default" 
            className="w-full sm:w-auto hover-lift"
            onClick={handleDeleteDownloaded}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Download
          </Button>
        </>
      ) : null}
      
      {((isTeacher && note.isOwnUpload && !downloadView) || downloadView) && (
        <Button 
          variant="outline" 
          size="default" 
          className="w-full sm:w-auto border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 hover-lift"
          onClick={downloadView ? handleDeleteDownloaded : handleDeleteFromDatabase}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {downloadView ? "Delete Download" : "Delete From Database"}
        </Button>
      )}
      
      {bookmarkView && (
        <Button 
          variant="outline" 
          size="default" 
          className="w-full sm:w-auto border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30 hover-lift"
          onClick={handleToggleBookmark}
        >
          <BookmarkX className="h-4 w-4 mr-2" />
          Remove Bookmark
        </Button>
      )}
      
      {(showRedirect || downloadView) && note.courseId && note.semesterId && note.subjectId && (
        <Link 
          to={`/courses/${note.courseId}/semesters/${note.semesterId}/subjects/${note.subjectId}`}
          className="w-full sm:w-auto"
        >
          <Button 
            variant="outline" 
            size="default" 
            className="w-full border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 hover-lift"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Subject Notes
          </Button>
        </Link>
      )}
    </div>
  );
};

export default NoteActions;
