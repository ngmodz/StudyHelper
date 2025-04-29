import React, { useState, useEffect } from 'react';
import { getCachedFile, isPWAMode, isIOSDevice, isAndroidDevice, saveToFilesApp, downloadNoteFile } from '@/utils/downloadsManager';
import { Button } from "@/components/ui/button";
import { FileIcon, Eye, Share2, Download, Save } from 'lucide-react';
import { Note } from '@/types/course';
import { useToast } from '@/hooks/use-toast';

interface FilePreviewProps {
  note: Note;
  className?: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ note, className }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isPWA, setIsPWA] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    setIsPWA(isPWAMode());
    setIsIOS(isIOSDevice());
    setIsAndroid(isAndroidDevice());
    
    const loadFile = async () => {
      setIsLoading(true);
      setLoadError(null);
      
      try {
        setPreviewUrl(note.fileUrl);
        
        const typeMap: Record<string, string> = {
          'pdf': 'application/pdf',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
        };
        setFileType(typeMap[note.fileType.toLowerCase()] || 'application/octet-stream');
      } catch (error) {
        console.error("Error in loadFile:", error);
        setLoadError(error instanceof Error ? error.message : "Failed to load file");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFile();
    
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [note]);
  
  const isImage = fileType && fileType.startsWith('image/');
  const isPDF = fileType === 'application/pdf';
  
  const handleShare = async () => {
    if (navigator.share && previewUrl) {
      try {
        await navigator.share({
          title: note.title,
          text: note.description,
          url: previewUrl
        });
        
        toast({
          title: "Share Success",
          description: "File URL has been shared",
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error("Error sharing:", error);
          toast({
            title: "Share Error",
            description: "Could not share the file",
            variant: "destructive"
          });
        }
      }
    } else {
      window.open(previewUrl, '_blank');
    }
  };

  const handleSaveToFiles = async () => {
    toast({
      title: "Saving to Files...",
      description: "Please wait while we prepare your file"
    });
    
    try {
      const success = await downloadNoteFile(note);
      
      if (success) {
        toast({
          title: "File Ready",
          description: isIOS 
            ? "You can now save to Files app" 
            : "File is ready for download",
        });
      } else {
        throw new Error("Failed to download file");
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error("Error saving to Files:", error);
        toast({
          title: "Save Error",
          description: "Could not save file",
          variant: "destructive"
        });
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 border border-gray-800 rounded-lg bg-gray-900 ${className}`}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-900/20 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-blue-900/20 rounded mb-3"></div>
          <div className="h-3 w-24 bg-blue-900/10 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (loadError) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 border border-gray-800 rounded-lg bg-gray-900 ${className}`}>
        <div className="text-center">
          <FileIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2 text-white">{note.title}.{note.fileType}</h3>
          <p className="text-sm text-red-400 mb-4">{loadError}</p>
          <Button onClick={handleSaveToFiles} className="w-full bg-blue-500 hover:bg-blue-600 mb-2">
            <Save className="h-4 w-4 mr-2" />
            Save to Files
          </Button>
        </div>
      </div>
    );
  }
  
  if (!previewUrl) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 border border-gray-800 rounded-lg bg-gray-900 ${className}`}>
        <div className="text-center">
          <FileIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2 text-white">{note.title}.{note.fileType}</h3>
          <p className="text-sm text-yellow-400 mb-4">Preview not available</p>
          <Button onClick={handleSaveToFiles} className="w-full bg-blue-500 hover:bg-blue-600 mb-2">
            <Save className="h-4 w-4 mr-2" />
            Download File
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col border border-gray-800 rounded-lg overflow-hidden bg-gray-900 ${className}`}>
      <div className="p-3 border-b border-gray-800 bg-gray-800/50 flex justify-between items-center">
        <h3 className="font-medium truncate text-white">{note.title}</h3>
        
        {(isPWA || isIOS || isAndroid) && (
          <Button variant="ghost" size="sm" onClick={handleShare} className="text-blue-400 hover:text-blue-300 hover:bg-gray-800">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        )}
      </div>
      
      <div className="flex flex-col items-center justify-center p-4 min-h-[200px] bg-gray-900">
        {isImage ? (
          <div className="flex flex-col items-center space-y-4">
            <img 
              src={previewUrl} 
              alt={note.title} 
              className="max-w-full max-h-[400px] object-contain" 
              loading="lazy"
            />
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <Button onClick={handleSaveToFiles} className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600">
                <Save className="h-4 w-4 mr-2" />
                Save to Files
              </Button>
              <Button onClick={handleShare} variant="outline" className="w-full sm:w-auto border-gray-700 text-gray-300">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        ) : isPDF ? (
          <div className="flex flex-col items-center space-y-4 w-full">
            {isAndroid || isIOS ? (
              <div className="w-full flex flex-col items-center">
                <FileIcon className="h-16 w-16 text-red-400 mb-4" />
                <p className="text-center text-gray-300 mb-6">
                  PDF preview is disabled on mobile to save memory
                </p>
              </div>
            ) : (
              <iframe 
                src={previewUrl} 
                title={note.title} 
                className="w-full h-[400px] border-0" 
                sandbox="allow-same-origin allow-scripts"
              />
            )}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <Button onClick={handleSaveToFiles} className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600">
                <Save className="h-4 w-4 mr-2" />
                Save to Files
              </Button>
              <Button onClick={handleShare} variant="outline" className="w-full sm:w-auto border-gray-700 text-gray-300">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              {(isAndroid || isIOS) && (
                <Button asChild variant="outline" className="w-full sm:w-auto border-gray-700 text-gray-300">
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 mr-2" />
                    View PDF
                  </a>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="h-16 w-16 rounded-lg bg-blue-900/20 flex items-center justify-center mb-3">
              <FileIcon className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-sm mb-1 text-white">{note.title}.{note.fileType}</p>
            <p className="text-xs text-gray-400 mb-4">
              {note.fileType.toUpperCase()} file
            </p>
            
            <div className="space-y-2 w-full max-w-xs">
              <Button onClick={handleSaveToFiles} className="w-full bg-blue-500 hover:bg-blue-600">
                <Save className="h-4 w-4 mr-2" />
                Save to Files
              </Button>
              <Button onClick={handleShare} variant="outline" className="w-full border-gray-700 text-gray-300">
                <Share2 className="h-4 w-4 mr-2" />
                Share File
              </Button>
              {!isPWA && (
                <Button asChild variant="outline" className="w-full border-gray-700 text-gray-300">
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 mr-2" />
                    View File
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreview;
