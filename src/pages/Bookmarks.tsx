
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/layout/Container';
import { AppLayout } from '@/components/ui/layout/AppLayout';
import NoteCard from '@/components/course/NoteCard';
import { Note } from '@/types/course';
import { useAuth } from '@/hooks/use-auth';
import { Bookmark, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Bookmarks = () => {
  const { user, isBookmarked, toggleBookmark } = useAuth();
  const [bookmarkedNotes, setBookmarkedNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkedNotes = async () => {
      setIsLoading(true);
      
      if (!user?.bookmarks || user.bookmarks.length === 0) {
        setBookmarkedNotes([]);
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Fetching notes for bookmarks:", user.bookmarks);
        
        // We're going to optimize by making targeted queries directly to specific paths
        const notes: Note[] = [];
        
        // Create a batch of promises for parallel fetching
        const fetchPromises = [];
        const paths = [];
        
        // Use these common paths for fetching
        const courseIds = ['bca']; 
        const semesterIds = [1, 2, 3, 4, 5, 6];
        const subjectIds = [
          'basics-mathematics', 'web-designing', 'web-design-lab', 'python',
          'python-lab', 'software-engineering', 'software-engineering-lab',
          'environmental-studies', 'data-visualization', 'oop-cpp',
          'oop-lab', 'discrete-structure', 'ai-ethics'
        ];
        
        // Instead of nested loops, we'll use a flatter approach and only query directories once
        const { data: directories, error: dirError } = await supabase
          .storage
          .from('notes')
          .list('');
          
        if (dirError) {
          console.error('Error fetching directories:', dirError);
          setIsLoading(false);
          return;
        }
        
        // Filter to only include directories that exist
        const existingCourseIds = directories?.filter(d => !d.name.includes('.')).map(d => d.name) || [];
        
        for (const courseId of existingCourseIds) {
          // Get semesters for this course
          const { data: semesterDirs } = await supabase
            .storage
            .from('notes')
            .list(courseId);
          
          if (!semesterDirs) continue;
          
          const existingSemesters = semesterDirs.filter(d => !d.name.includes('.')).map(d => d.name);
          
          for (const semesterId of existingSemesters) {
            // Get subjects for this semester
            const { data: subjectDirs } = await supabase
              .storage
              .from('notes')
              .list(`${courseId}/${semesterId}`);
            
            if (!subjectDirs) continue;
            
            const existingSubjects = subjectDirs.filter(d => !d.name.includes('.')).map(d => d.name);
            
            for (const subjectId of existingSubjects) {
              paths.push(`${courseId}/${semesterId}/${subjectId}`);
            }
          }
        }
        
        // Now fetch files from each valid path
        for (const path of paths) {
          fetchPromises.push(
            (async () => {
              try {
                const { data: files, error } = await supabase
                  .storage
                  .from('notes')
                  .list(path);
                  
                if (error || !files || files.length === 0) return [];
                
                // Only process files that are bookmarked
                const bookmarkedFiles = files.filter(file => user.bookmarks?.includes(file.id));
                if (bookmarkedFiles.length === 0) return [];
                
                const pathParts = path.split('/');
                const courseId = pathParts[0];
                const semesterId = parseInt(pathParts[1]);
                const subjectId = pathParts[2];
                
                return bookmarkedFiles.map(file => {
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
                    description: `Note from ${subjectId.replace(/-/g, ' ')}`,
                    fileUrl: data.publicUrl,
                    fileType: fileType,
                    uploadDate: uploadDate,
                    uploadedBy: 'Teacher',
                    subjectId: subjectId,
                    semesterId: semesterId,
                    courseId: courseId,
                    isOwnUpload: false
                  };
                });
              } catch (err) {
                console.error(`Error processing ${path}:`, err);
                return [];
              }
            })()
          );
        }
        
        // Wait for all promises to resolve
        const results = await Promise.all(fetchPromises);
        
        // Flatten results array and filter out empty arrays
        const allNotes = results.flat();
        
        console.log("Found bookmarked notes:", allNotes);
        setBookmarkedNotes(allNotes);
      } catch (error) {
        console.error("Error fetching bookmarked notes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookmarkedNotes();
  }, [user?.bookmarks]);
  
  const handleRemoveBookmark = async (noteId: string) => {
    try {
      await toggleBookmark(noteId);
      setBookmarkedNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  return (
    <AppLayout title="Bookmarks">
      <div className="bg-background min-h-screen pb-24">
        <Container className="py-6 space-y-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground animate-slide-down">
                <span className="flex items-center gap-2">
                  <Bookmark className="h-7 w-7" />
                  Bookmarked Notes
                </span>
              </h2>
              <p className="text-muted-foreground animate-slide-up">
                Quick access to your saved notes
              </p>
            </div>
          </div>
          
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : bookmarkedNotes.length > 0 ? (
              bookmarkedNotes.map((note) => (
                <NoteCard 
                  key={note.id} 
                  note={note}
                  bookmarkView={true}
                  onRemoveBookmark={handleRemoveBookmark}
                  showRedirect={true}
                />
              ))
            ) : (
              <div className="text-center py-12 border border-border rounded-lg bg-card/50">
                <p className="text-muted-foreground">No bookmarked notes yet.</p>
                <p className="text-sm mt-2 text-muted-foreground">
                  Bookmark notes from subjects to see them here.
                </p>
              </div>
            )}
          </div>
        </Container>
      </div>
    </AppLayout>
  );
};

export default Bookmarks;
