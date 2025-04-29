
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Calendar, ChevronRight } from 'lucide-react';

interface SemesterCardProps {
  courseId: string;
  semesterNumber: number;
  className?: string;
}

export const SemesterCard: React.FC<SemesterCardProps> = ({
  courseId,
  semesterNumber,
  className,
}) => {
  const getSemesterTitle = (num: number): string => {
    switch (num) {
      case 1: return "Foundation of Computer Science & AI";
      case 2: return "Core Programming & AI Basics";
      case 3: return "Data Structures & Artificial Intelligence";
      case 4: return "Machine Learning & Databases";
      case 5: return "AI, NLP & Big Data";
      case 6: return "Deep Learning & Network Security";
      default: return `Semester ${num}`;
    }
  };

  return (
    <Link
      to={`/courses/${courseId}/semesters/${semesterNumber}`}
      className={cn(
        'card-container mb-4 hover:border-primary/30 hover:bg-secondary/50',
        className
      )}
    >
      <div className="flex items-center justify-between p-2 sm:p-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-base sm:text-lg">Semester {semesterNumber}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{getSemesterTitle(semesterNumber)}</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-primary/70" />
      </div>
    </Link>
  );
};

export default SemesterCard;
