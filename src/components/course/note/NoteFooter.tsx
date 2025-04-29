
import React from 'react';

interface NoteFooterProps {
  uploadDate: string;
  fileType: string;
}

export const NoteFooter: React.FC<NoteFooterProps> = ({
  uploadDate,
  fileType
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <div className="mt-4 pt-3 border-t border-border/60 flex justify-between items-center text-xs text-muted-foreground">
      <span>Uploaded: {formatDate(uploadDate)}</span>
      <span className="px-2 py-1 rounded-full bg-secondary text-xs">{fileType.toUpperCase()}</span>
    </div>
  );
};

export default NoteFooter;
