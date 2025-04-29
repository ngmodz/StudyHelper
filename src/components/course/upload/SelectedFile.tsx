
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SelectedFileProps {
  file: File;
  onClearFile: (e: React.MouseEvent) => void;
}

export const SelectedFile: React.FC<SelectedFileProps> = ({
  file,
  onClearFile
}) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center">
        <div className="text-sm font-medium truncate max-w-[240px] sm:max-w-xs">
          {file.name}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearFile}
        className="ml-2 h-8 w-8 p-0"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Remove file</span>
      </Button>
    </div>
  );
};

export default SelectedFile;
