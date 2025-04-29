
import React from 'react';
import { UploadCloud } from 'lucide-react';

interface DropZoneProps {
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  handleDropzoneClick: () => void;
}

export const DropZone: React.FC<DropZoneProps> = ({
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleDropzoneClick
}) => {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleDropzoneClick}
    >
      <div className="flex flex-col items-center justify-center py-4 space-y-2">
        <UploadCloud className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">
          Drag & drop your file here or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Supports PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, GIF
        </p>
      </div>
    </div>
  );
};

export default DropZone;
