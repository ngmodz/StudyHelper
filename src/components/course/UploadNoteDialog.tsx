
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import FileUpload from './FileUpload';
import { UploadNoteFormData } from '@/types/course';
import { Loader2 } from 'lucide-react';

interface UploadNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UploadNoteFormData) => void;
  isUploading?: boolean;
}

const UploadNoteDialog: React.FC<UploadNoteDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isUploading = false
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setTitle('');
      setDescription('');
      setFile(null);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !file) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onSubmit({
        title,
        description,
        file
      });
      
      // Don't close the dialog or reset the form here
      // Let the parent component handle that after the upload is complete
      if (!isUploading) {
        // Reset form
        setTitle('');
        setDescription('');
        setFile(null);
        
        // Close dialog
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (isUploading || isSubmitting) return; // Prevent closing while uploading
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload Notes</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notes title"
                required
                disabled={isUploading || isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a brief description"
                className="min-h-[80px]"
                disabled={isUploading || isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Upload File</Label>
              <FileUpload onFileChange={setFile} disabled={isUploading || isSubmitting} />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                disabled={isUploading || isSubmitting}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isUploading || isSubmitting || !title || !file}
            >
              {isUploading || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : 'Upload Notes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadNoteDialog;
