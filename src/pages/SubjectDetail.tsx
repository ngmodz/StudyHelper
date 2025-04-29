import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/layout/Container';
import { AppLayout } from '@/components/ui/layout/AppLayout';
import NoteCard from '@/components/course/NoteCard';
import { Note, UploadNoteFormData } from '@/types/course';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import UploadNoteDialog from '@/components/course/UploadNoteDialog';
import { useAuth } from '@/hooks/use-auth';
import { uploadFileToStorage, supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

const SubjectDetail = () => {
  const { courseId, semesterId, subjectId } = useParams<{ 
    courseId: string; 
    semesterId: string;
    subjectId: string;
  }>();
  
  const { user, isTeacher } = useAuth();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const getSubjectName = (id: string): string => {
    const subjectMap: Record<string, string> = {
      'basics-mathematics': 'Basics of Mathematics',
      'web-designing': 'Web Designing Using HTML, CSS, JavaScript & PHP',
      'web-design-lab': 'Web Design Lab',
      'python': 'Clean Coding with Python',
      'python-lab': 'Clean Coding with Python Lab',
      'software-engineering': 'Essentials of Software Engineering',
      'software-engineering-lab': 'Essentials of Software Engineering Lab',
      'environmental-studies': 'Environmental Studies & Disaster Management',
      'data-visualization': 'Data Visualization using Power BI',
      'oop-cpp': 'Fundamentals of Object-Oriented Programming using C++',
      'oop-lab': 'Object-Oriented Programming Lab using C++',
      'discrete-structure': 'Discrete Structure',
      'ai-ethics': 'Overview of AI, Data Science, Ethics, and Foundation of Data Analysis',
      'ai-ethics-lab': 'Overview of AI, Data Science, Ethics, and Foundation of Data Analysis Lab',
      'r-programming': 'R Programming for Data Science and Data Analytics Lab',
      'open-elective-1': 'Open Elective – I',
      'data-structures': 'Fundamentals of Data Structures',
      'data-structures-lab': 'Fundamentals of Data Structures Lab',
      'java-programming': 'Fundamentals of Java Programming',
      'java-lab': 'Fundamentals of Java Programming Lab',
      'probabilistic-modelling': 'Probabilistic Modelling and Reasoning',
      'ai-fundamentals': 'Fundamentals of Artificial Intelligence',
      'open-elective-2': 'Open Elective - II',
      'life-skills-1': 'Life Skills for Professionals – I',
      'vac-1': 'VAC-I',
      'operating-systems': 'Fundamentals of Operating Systems',
      'operating-systems-lab': 'Fundamentals of Operating System Lab',
      'dbms': 'Fundamentals of Database Management Systems',
      'dbms-lab': 'Fundamentals of Database Management Systems Lab',
      'machine-learning': 'Foundation of Machine Learning',
      'ml-lab': 'Foundation of Machine Learning Lab',
      'big-data-lab': 'Big Data Analysis with Scala and Spark Lab',
      'open-elective-3': 'Open Elective - III',
      'life-skills-2': 'Life Skills for Professionals – II',
      'algorithms': 'Design and Analysis of Algorithms',
      'algorithms-lab': 'Design & Analysis of Algorithms Lab',
      'automata': 'Theory of Automata',
      'nlp': 'Introduction to Natural Language Processing',
      'nlp-lab': 'Introduction to Natural Language Processing Lab',
      'data-science-lab': 'Data Science - Tools and Techniques Lab',
      'life-skills-3': 'Life Skills for Professionals - III',
      'computer-architecture': 'Introduction to Computer Organization & Architecture',
      'networks': 'Introduction to Computer Networks',
      'networks-lab': 'Introduction to Computer Networks Lab',
      'neural-networks': 'Basics of Neural Networks and Deep Learning',
      'neural-networks-lab': 'Basics of Neural Networks and Deep Learning Lab',
      'dept-elective-1': 'Department Elective I',
      'dept-elective-lab': 'Department Elective I Lab',
      'minor-project': 'Minor Project - III'
    };
    
    return subjectMap[id] || 'Subject';
  };
  
  const subjectName = getSubjectName(subjectId || '');
  
  const [notes, setNotes] = useState<Note[]>([]);
  
  const fetchNotesFromStorage = async () => {
    if (!courseId || !semesterId || !subjectId) return;
    
    setIsLoading(true);
    
    try {
      console.log("Fetching notes from storage...");
      
      const path = `${courseId}/${semesterId}/${subjectId}`;
      
      const { data: files, error } = await supabase
        .storage
        .from('notes')
        .list(path, { 
          sortBy: { column: 'created_at', order: 'desc' }
        });
      
      if (error) {
        console.error('Error fetching notes:', error);
        throw error;
      }
      
      if (!files || files.length === 0) {
        console.log('No files found in storage');
        setNotes([]);
        return;
      }
      
      console.log('Files found in storage:', files);
      
      const notesList: Note[] = files.map(file => {
        const fileName = file.name.split('-').slice(1).join('-');
        const fileType = fileName.split('.').pop() || '';
        const uploadDate = new Date(parseInt(file.name.split('-')[0])).toISOString();
        
        const { data } = supabase
          .storage
          .from('notes')
          .getPublicUrl(`${path}/${file.name}`);
        
        return {
          id: file.id,
          title: fileName.split('.')[0],
          description: `Note uploaded on ${formatDate(uploadDate)}`,
          fileUrl: data.publicUrl,
          fileType: fileType,
          uploadDate: uploadDate,
          uploadedBy: user?.id || 'Teacher',
          subjectId: subjectId,
          semesterId: parseInt(semesterId),
          courseId: courseId,
          isOwnUpload: isTeacher
        };
      });
      
      console.log('Processed notes:', notesList);
      setNotes(notesList);
      
    } catch (error) {
      console.error('Error loading notes from storage:', error);
      toast({
        title: "Could not load notes",
        description: "There was a problem fetching notes from storage",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNotesFromStorage();
  }, [courseId, semesterId, subjectId]);
  
  const handleUploadNote = async (data: UploadNoteFormData) => {
    if (!data.file) return;
    
    setIsUploading(true);
    
    try {
      const file = data.file;
      
      const fileUrl = await uploadFileToStorage(file, `${courseId}/${semesterId}/${subjectId}`);
      
      console.log('File uploaded successfully, URL:', fileUrl);
      
      await fetchNotesFromStorage();
      
      toast({
        title: "Note uploaded successfully",
        description: "Your note has been saved to the cloud",
      });
      
      setUploadDialogOpen(false);
    } catch (error) {
      console.error("Error uploading note:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your note. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDeleteNote = async (noteId: string) => {
    if (!isTeacher) return;
    
    try {
      const noteToDelete = notes.find(note => note.id === noteId);
      if (!noteToDelete) {
        console.error('Note not found');
        return;
      }
      
      console.log('Attempting to delete note:', noteToDelete);
      
      // The most aggressive approach: try multiple methods to ensure deletion
      
      // Method 1: Extract file name from URL and use it with bucket path
      const noteUrl = new URL(noteToDelete.fileUrl);
      const urlPath = decodeURIComponent(noteUrl.pathname);
      console.log('URL path decoded:', urlPath);
      
      const fileName = urlPath.split('/').pop();
      const bucketPath = `${courseId}/${semesterId}/${subjectId}/${fileName}`;
      console.log('Method 1 - Bucket path with filename:', bucketPath);
      
      // Method 2: Extract path after "notes/" from URL
      const pathParts = urlPath.split('/');
      const notesIndex = pathParts.findIndex(part => part === 'notes');
      const storagePath = notesIndex !== -1 ? pathParts.slice(notesIndex + 1).join('/') : null;
      console.log('Method 2 - Storage path after "notes/":', storagePath);
      
      // Method 3: Use a direct path construction from our data
      const files = await supabase.storage.from('notes').list(`${courseId}/${semesterId}/${subjectId}`);
      const fileMatch = files.data?.find(file => file.id === noteId);
      const directPath = fileMatch ? `${courseId}/${semesterId}/${subjectId}/${fileMatch.name}` : null;
      console.log('Method 3 - Direct path from listing:', directPath);
      
      // Try all possible paths in sequence until one works
      let deletionSucceeded = false;
      const pathsToTry = [bucketPath, storagePath, directPath].filter(Boolean) as string[];
      
      console.log('Attempting deletion with these paths:', pathsToTry);
      
      // First, try direct Supabase API call for all paths
      for (const path of pathsToTry) {
        try {
          console.log(`Trying to delete with path: ${path}`);
          const { error } = await supabase.storage.from('notes').remove([path]);
          
          if (!error) {
            console.log(`Successfully deleted file using path: ${path}`);
            deletionSucceeded = true;
            break;
          } else {
            console.error(`Failed to delete using path: ${path}`, error);
          }
        } catch (err) {
          console.error(`Error during deletion with path ${path}:`, err);
        }
      }
      
      // If all direct calls failed, try with adminAPICall if available (depends on your setup)
      if (!deletionSucceeded) {
        console.log('All direct deletion methods failed, trying alternative approach');
        
        try {
          // Try one more time with a different approach - bucket removal with additional logging
          const finalPath = `${courseId}/${semesterId}/${subjectId}`;
          console.log(`Final attempt: Listing files in path ${finalPath} to find exact match`);
          
          const { data: filesList, error: listError } = await supabase.storage.from('notes').list(finalPath);
          
          if (listError) {
            console.error('Error listing files for final attempt:', listError);
          } else if (filesList) {
            console.log('Files found in directory:', filesList);
            
            // Find the file by ID
            const fileToDelete = filesList.find(file => file.id === noteId);
            
            if (fileToDelete) {
              console.log('Found exact file to delete:', fileToDelete);
              const exactPath = `${finalPath}/${fileToDelete.name}`;
              console.log('Attempting deletion with exact path:', exactPath);
              
              const { error: deleteError } = await supabase.storage.from('notes').remove([exactPath]);
              
              if (deleteError) {
                console.error('Final deletion attempt failed:', deleteError);
              } else {
                console.log('Final deletion attempt succeeded!');
                deletionSucceeded = true;
              }
            } else {
              console.error('Could not find file with ID', noteId, 'in directory listing');
            }
          }
        } catch (err) {
          console.error('Error in final deletion attempt:', err);
        }
      }
      
      // Update UI regardless of backend success (we can assume it eventually succeeded or will be cleaned up)
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      
      if (deletionSucceeded) {
        toast({
          title: "Note deleted",
          description: "The note has been removed from storage",
        });
      } else {
        // Even though we show this error, we've already removed it from the UI
        toast({
          title: "Note deletion status unclear",
          description: "The note was removed from the UI but there might have been an issue with storage deletion",
          variant: "destructive"
        });
        
        // Force refresh the notes list to ensure UI is in sync with actual storage
        setTimeout(() => {
          fetchNotesFromStorage();
        }, 1500);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete the note. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <AppLayout title="Notes">
      <div className="bg-background min-h-screen pb-24">
        <Container className="py-6 space-y-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground animate-slide-down">{subjectName}</h2>
              <p className="text-muted-foreground animate-slide-up">
                Access all lecture notes and course materials
              </p>
            </div>
          </div>
          
          {isTeacher && (
            <Button 
              onClick={() => setUploadDialogOpen(true)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg py-3 hover-lift"
              disabled={isUploading}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              {isUploading ? "Uploading..." : "Upload Notes"}
            </Button>
          )}
          
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : notes.length > 0 ? (
              notes.map((note) => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  isTeacher={isTeacher}
                  onDeleteNote={isTeacher ? handleDeleteNote : undefined}
                />
              ))
            ) : (
              <div className="text-center py-12 border border-border rounded-lg bg-card/50">
                <p className="text-muted-foreground">No notes available yet.</p>
                {isTeacher && (
                  <p className="text-sm mt-2 text-muted-foreground">Click "Upload Notes" to add notes for this subject.</p>
                )}
              </div>
            )}
          </div>
        </Container>
      </div>
      
      {isTeacher && (
        <UploadNoteDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          onSubmit={handleUploadNote}
          isUploading={isUploading}
        />
      )}
    </AppLayout>
  );
};

export default SubjectDetail;
