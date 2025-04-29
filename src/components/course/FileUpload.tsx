
import React, { useState, useRef } from 'react';
import DropZone from './upload/DropZone';
import SelectedFile from './upload/SelectedFile';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileChange,
  accept = '.pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif',
  disabled = false
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      onFileChange(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    if (disabled) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files?.length) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      onFileChange(droppedFile);
    }
  };

  const handleClearFile = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation(); // Prevent click from propagating to parent
    setFile(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Separate function to handle click on the dropzone
  const handleDropzoneClick = () => {
    if (disabled) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`w-full ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        disabled={disabled}
      />
      
      {!file ? (
        <DropZone 
          isDragging={isDragging}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          handleDropzoneClick={handleDropzoneClick}
        />
      ) : (
        <SelectedFile 
          file={file}
          onClearFile={handleClearFile}
        />
      )}
    </div>
  );
};

export default FileUpload;
