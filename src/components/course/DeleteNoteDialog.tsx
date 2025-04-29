
import React from 'react';
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

interface DeleteNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  noteTitle: string;
  isDownloadedNote?: boolean;
}

const DeleteNoteDialog: React.FC<DeleteNoteDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  noteTitle,
  isDownloadedNote = false
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDownloadedNote ? "Delete Downloaded Notes" : "Delete Notes"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isDownloadedNote 
              ? `Are you sure you want to delete "${noteTitle}" from your downloads? This will only remove it from your local device.`
              : `Are you sure you want to delete "${noteTitle}" from the database? This action cannot be undone and will remove the notes for all users.`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteNoteDialog;
