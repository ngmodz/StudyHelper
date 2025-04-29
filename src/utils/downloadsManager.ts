// Downloads manager utility
import { Note } from "@/types/course";
import { supabase } from '@/integrations/supabase/client';

// Cache expiration time in milliseconds (1 hour)
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000;

// Get the storage key for the current user
const getUserStorageKey = (userId: string | undefined): string => {
  return userId ? `downloadedNotes_${userId}` : 'downloadedNotes';
};

// Check if we have storage access (always returns true for web environment)
export const hasStorageAccess = (): boolean => {
  try {
    // Simple test to check if localStorage is accessible
    localStorage.setItem('storage_test', 'test');
    localStorage.removeItem('storage_test');
    return true;
  } catch (error) {
    console.error("Storage access error:", error);
    return false;
  }
};

// Check if the user is on a mobile device
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check specifically for iOS devices
export const isIOSDevice = (): boolean => {
  // Use the userAgent to detect iOS devices
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(ua) && !(window as any).MSStream;
};

// Check specifically for Android devices
export const isAndroidDevice = (): boolean => {
  return /Android/i.test(navigator.userAgent);
};

// Check if running in standalone/PWA mode
export const isPWAMode = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true || 
         document.documentElement.getAttribute('data-app-mode') === 'standalone';
};

// Store the file blob in memory for PWA mode (used for file preview)
const fileCache = new Map<string, { 
  blob: Blob, 
  url: string, 
  type: string, 
  timestamp: number 
}>();

// Validate note object before download
const validateNote = (note: Note): boolean => {
  if (!note || !note.id || !note.title || !note.fileUrl) {
    console.error("Invalid note object:", note);
    return false;
  }
  
  // Check if the fileUrl is a valid URL
  try {
    new URL(note.fileUrl);
    return true;
  } catch (error) {
    console.error("Invalid fileUrl:", note.fileUrl);
    return false;
  }
};

// Fix URL encoding if needed
const ensureProperUrlEncoding = (url: string): string => {
  try {
    if (!url) {
      console.error("Empty URL passed to ensureProperUrlEncoding");
      return "";
    }
    
    // Try to normalize the URL by first decoding it (avoid double encoding)
    let normalizedUrl;
    try {
      normalizedUrl = decodeURIComponent(url);
    } catch (e) {
      // If decoding fails, use the original
      normalizedUrl = url;
      console.warn("Failed to decode URL, using original:", url);
    }
    
    // Fix common URL encoding issues while preserving structure
    const fixedUrl = normalizedUrl
      // Fix spaces - ensure they're properly encoded
      .replace(/(%20| )/g, '%20')
      // Preserve slashes for URL paths
      .replace(/%2F/g, '/')
      // Fix plus signs which can be misinterpreted
      .replace(/\+/g, '%2B')
      // Fix special characters commonly used in filenames
      .replace(/[()]/g, (match) => encodeURIComponent(match));
      
    // Make sure the URL is valid by testing it
    try {
      new URL(fixedUrl);
      console.log("URL successfully encoded:", fixedUrl);
      return fixedUrl;
    } catch (urlError) {
      console.error("Invalid URL after encoding:", fixedUrl);
      // If the fixed URL is invalid, try to use the original
      try {
        new URL(url);
        return url;
      } catch (originalUrlError) {
        console.error("Original URL is also invalid:", url);
        throw new Error("Unable to create a valid URL");
      }
    }
  } catch (error) {
    console.error("URL encoding error:", error);
    // Return the original URL as a last resort
    return url;
  }
};

// Get the correct URL for Supabase storage objects
const getCorrectStorageUrl = (url: string): string => {
  try {
    // First check if we have a valid URL
    if (!url) {
      console.error("Empty URL passed to getCorrectStorageUrl");
      return "";
    }
    
    // Check if this URL contains "supabase" and "storage"
    if (url.includes('supabase') && url.includes('storage')) {
      console.log("Processing Supabase storage URL:", url);
      
      // Extract any parameters from the URL (if present)
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      // Direct public URL conversion - no need to construct signed URLs
      // Just ensure the URL is properly formed and has no caching issues
      if (!url.includes('?')) {
        // Add a cache-busting parameter to prevent caching issues
        return `${url}?t=${Date.now()}`;
      }
      
      // URL already has parameters, just return it as is
      return url;
    }
    
    // For non-storage URLs, just return the original
    return url;
  } catch (error) {
    console.error("Error formatting storage URL:", error);
    return url;
  }
};

// Download with retry mechanism
export const downloadNoteWithRetry = async (note: Note, maxRetries = 3): Promise<boolean> => {
  let retries = 0;
  let success = false;

  while (retries < maxRetries && !success) {
    try {
      console.log(`Download attempt ${retries + 1} for note:`, note.title);
      success = await downloadNoteFile(note);
      
      if (success) {
        console.log(`Download successful on attempt ${retries + 1}`);
        return true;
      }
      
      retries++;
      // Wait a bit before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      
    } catch (error) {
      console.error(`Error on download attempt ${retries + 1}:`, error);
      retries++;
      
      // Wait a bit before retrying (exponential backoff)
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
  }

  console.error(`Download failed after ${maxRetries} attempts`);
  return false;
};

// Handle file downloads to device storage without permission popups
export const downloadNoteFile = async (note: Note): Promise<boolean> => {
  try {
    console.log("Download started for note:", note.title);
    
    // Extract file path from the Supabase storage URL
    const extractFilePath = (url: string) => {
      const matches = url.match(/\/notes\/(.+)$/);
      return matches ? matches[1] : null;
    };

    const filePath = extractFilePath(note.fileUrl);
    
    if (!filePath) {
      console.error("Invalid file URL:", note.fileUrl);
      throw new Error("Could not extract file path from URL");
    }

    // Download file from Supabase storage
    const { data, error } = await supabase.storage
      .from('notes')
      .download(filePath);

    if (error) {
      console.error("Supabase storage download error:", error);
      throw error;
    }

    if (!data) {
      console.error("No file data received");
      throw new Error("No file data received");
    }

    // Create a blob URL for the file
    const blobUrl = URL.createObjectURL(data);

    // Create a link element to trigger download
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${note.title}.${note.fileType}`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 100);

    // Save note to storage
    saveNoteToStorage(note, note.uploadedBy);

    return true;
  } catch (error) {
    console.error("Error downloading note:", error);
    return false;
  }
};

// Get cached file blob
export const getCachedFile = (noteId: string): { blob: Blob, url: string, type: string } | undefined => {
  const cachedFile = fileCache.get(noteId);
  
  if (cachedFile) {
    // Update timestamp to extend cache lifetime
    cachedFile.timestamp = Date.now();
    return {
      blob: cachedFile.blob,
      url: cachedFile.url,
      type: cachedFile.type
    };
  }
  
  return undefined;
};

// Clear cache entries that have expired
const clearExpiredCache = (): void => {
  const now = Date.now();
  
  for (const [noteId, cachedFile] of fileCache.entries()) {
    if (now - cachedFile.timestamp > CACHE_EXPIRATION_TIME) {
      // Revoke object URL to free memory
      if (cachedFile.url) {
        URL.revokeObjectURL(cachedFile.url);
      }
      fileCache.delete(noteId);
    }
  }
};

// Save a note to localStorage with proper error handling
export const saveNoteToStorage = (note: Note, userId?: string): boolean => {
  try {
    console.log("Saving note to storage:", note.title, "for user ID:", userId);
    
    // Validate note before saving
    if (!validateNote(note)) {
      console.error("Invalid note object passed to saveNoteToStorage");
      return false;
    }
    
    // Get existing downloads or initialize empty array
    const existingDownloads = getDownloadedNotes(userId);
    
    // Check if note already exists in downloads
    const noteExists = existingDownloads.some(item => item.id === note.id);
    
    if (!noteExists) {
      // Add note to downloads and save - ensure we're creating a new array
      // Remove any large data from the note object before saving to localStorage
      const noteForStorage = {
        ...note,
        cachedBlobUrl: undefined // Don't store blob URLs in localStorage
      };
      
      const updatedDownloads = [...existingDownloads, noteForStorage];
      localStorage.setItem(getUserStorageKey(userId), JSON.stringify(updatedDownloads));
      console.log(`Note saved to storage: ${note.title}`);
    } else {
      console.log(`Note ${note.title} already exists in storage, not adding duplicate`);
    }
    
    return true;
  } catch (error) {
    console.error("Error saving note to storage:", error);
    return false;
  }
};

// Get all downloaded notes from storage
export const getDownloadedNotes = (userId?: string): Note[] => {
  try {
    const storageKey = getUserStorageKey(userId);
    console.log("Getting notes from storage key:", storageKey);
    const downloads = localStorage.getItem(storageKey);
    
    if (!downloads) {
      return [];
    }
    
    try {
      // Parse and validate notes
      const parsedNotes = JSON.parse(downloads);
      if (!Array.isArray(parsedNotes)) {
        console.error("Downloaded notes is not an array");
        return [];
      }
      
      // Filter out invalid notes
      const validNotes = parsedNotes.filter(note => 
        note && note.id && note.title && note.fileUrl
      );
      
      return validNotes;
    } catch (parseError) {
      console.error("Error parsing downloaded notes:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Error retrieving downloaded notes:", error);
    return [];
  }
};

// Check if a note is downloaded
export const isNoteDownloaded = (noteId: string, userId?: string): boolean => {
  try {
    const downloads = getDownloadedNotes(userId);
    return downloads.some(note => note.id === noteId);
  } catch (error) {
    console.error("Error checking if note is downloaded:", error);
    return false;
  }
};

// Delete a specific note from downloads
export const deleteDownloadedNote = (noteId: string, userId?: string): boolean => {
  try {
    console.log("Deleting note:", noteId, "for user:", userId);
    // First clean up any cached file if it exists
    if (fileCache.has(noteId)) {
      const cachedFile = fileCache.get(noteId);
      if (cachedFile && cachedFile.url) {
        URL.revokeObjectURL(cachedFile.url);
      }
      fileCache.delete(noteId);
    }
    
    const downloads = getDownloadedNotes(userId);
    const updatedDownloads = downloads.filter(note => note.id !== noteId);
    localStorage.setItem(getUserStorageKey(userId), JSON.stringify(updatedDownloads));
    return true;
  } catch (error) {
    console.error("Error deleting note:", error);
    return false;
  }
};

// Delete all downloaded notes
export const deleteAllDownloadedNotes = (userId?: string): boolean => {
  try {
    // Clean up all cached files
    getDownloadedNotes(userId).forEach(note => {
      if (fileCache.has(note.id)) {
        const cachedFile = fileCache.get(note.id);
        if (cachedFile && cachedFile.url) {
          URL.revokeObjectURL(cachedFile.url);
        }
        fileCache.delete(note.id);
      }
    });
    
    localStorage.removeItem(getUserStorageKey(userId));
    return true;
  } catch (error) {
    console.error("Error deleting all notes:", error);
    return false;
  }
};

// Save directly to Files app using Web Share API (mainly for iOS)
export const saveToFilesApp = async (note: Note): Promise<boolean> => {
  try {
    console.log("Saving to Files app:", note.title);
    // First check if we need to fetch the file
    let cachedFile = getCachedFile(note.id);
    
    if (!cachedFile) {
      // If not cached, just initiate a regular download
      return downloadNoteFile(note);
    }
    
    // Create a proper filename
    const filename = `${note.title.replace(/[^a-z0-9]/gi, '_')}.${note.fileType}`;
    const file = new File([cachedFile.blob], filename, { type: cachedFile.type });
    
    // Prepare share data
    const shareData = {
      files: [file],
      title: note.title,
      text: `${note.title} - ${note.description}`
    };
    
    // Check if web share API supports file sharing
    if (navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      console.log("File shared successfully via Web Share API");
      return true;
    } else {
      // Fallback method if Web Share API isn't available
      console.log("Web Share API not available, using download attribute");
      return downloadNoteFile(note);
    }
  } catch (error) {
    console.error("Error saving to Files app:", error);
    return false;
  }
};

// Clear all cached files when component unmounts
export const clearFileCache = (): void => {
  for (const [, cachedFile] of fileCache.entries()) {
    if (cachedFile && cachedFile.url) {
      URL.revokeObjectURL(cachedFile.url);
    }
  }
  fileCache.clear();
};

// Periodically clear expired cache entries
setInterval(clearExpiredCache, 15 * 60 * 1000); // Run every 15 minutes
