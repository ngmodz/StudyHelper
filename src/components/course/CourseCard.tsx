
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Clock, ChevronRight, BookOpen } from 'lucide-react';
import { Course } from '@/types/course';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
  course: Course;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, className }) => {
  const isAvailable = course.status === 'available';

  return (
    <div 
      className={cn(
        'card-container rounded-xl p-6 mb-6',
        isAvailable ? 'hover:shadow-md transition-shadow' : 'opacity-90',
        className
      )}
    >
      <div className="flex flex-col space-y-4">
        {/* Icon */}
        <div className="flex justify-between items-start">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
          
          {/* Status badge */}
          <div className={cn(
            "pill-badge text-xs py-1 px-3 rounded-full font-medium",
            isAvailable 
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
          )}>
            {isAvailable ? "Active" : "Coming Soon"}
          </div>
        </div>
        
        {/* Course title and description */}
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{course.shortName}</h3>
          <p className="text-gray-600 dark:text-gray-400">{course.name}</p>
        </div>
        
        {/* Semesters info */}
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <Clock className="mr-2 h-4 w-4" />
          <span>{course.semesters} Semesters</span>
        </div>
        
        {/* Action button */}
        {isAvailable ? (
          <Link to={`/courses/${course.id}`} className="inline-block mt-2">
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary hover:bg-primary/10 p-0 justify-start"
            >
              View Course <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Button 
            variant="ghost" 
            className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 p-0 justify-start mt-2"
            disabled
          >
            Coming Soon <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
