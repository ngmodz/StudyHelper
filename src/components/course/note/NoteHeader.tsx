
import React from 'react';
import { Bookmark } from 'lucide-react';

interface NoteHeaderProps {
  title: string;
  description: string;
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent) => void;
}

export const NoteHeader: React.FC<NoteHeaderProps> = ({
  title,
  description,
  isBookmarked,
  onToggleBookmark
}) => {
  return (
    <div className="flex justify-between mb-4">
      <div className="flex-1 pr-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{description}</p>
        )}
      </div>
      <button
        onClick={onToggleBookmark}
        className={`h-6 w-6 flex-shrink-0 transform transition-transform hover:scale-110 ${
          isBookmarked ? 'text-amber-500' : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
      </button>
    </div>
  );
};

export default NoteHeader;
