
import React from 'react';
import SemesterCard from './SemesterCard';

interface SemesterListProps {
  courseId: string;
  semesterCount: number;
}

export const SemesterList: React.FC<SemesterListProps> = ({ 
  courseId, 
  semesterCount
}) => {
  return (
    <div className="space-y-0 animate-fade-in mt-4" style={{ animationDelay: '0.2s' }}>
      {Array.from({ length: semesterCount }, (_, i) => i + 1).map((semesterNumber) => (
        <SemesterCard 
          key={semesterNumber} 
          courseId={courseId} 
          semesterNumber={semesterNumber}
        />
      ))}
    </div>
  );
};

export default SemesterList;
