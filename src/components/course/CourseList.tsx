
import React from 'react';
import CourseCard from './CourseCard';
import { Course } from '@/types/course';

interface CourseListProps {
  courses: Course[];
}

export const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  return (
    <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
