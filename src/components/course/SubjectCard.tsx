
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Subject } from '@/types/course';

interface SubjectCardProps {
  subject: Subject;
  className?: string;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  className,
}) => {
  return (
    <Link
      to={`/courses/${subject.courseId}/semesters/${subject.semesterId}/subjects/${subject.id}`}
      className={cn(
        'card-container button-hover',
        className
      )}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="font-medium text-foreground mb-1">{subject.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{subject.description}</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
      </div>
    </Link>
  );
};

export default SubjectCard;
