
import React from 'react';
import { Container } from '@/components/ui/layout/Container';
import { AppLayout } from '@/components/ui/layout/AppLayout';
import CourseList from '@/components/course/CourseList';
import { Course } from '@/types/course';

const Courses = () => {
  // Mock data for courses
  const courses: Course[] = [
    {
      id: 'bca',
      name: 'Bachelor of Computer Applications',
      shortName: 'BCA',
      description: 'Comprehensive program covering programming, web development, and software engineering',
      status: 'available',
      semesters: 6
    },
    {
      id: 'btech',
      name: 'Bachelor of Technology',
      shortName: 'BTech',
      description: 'Engineering degree with focus on technical and practical aspects of computer science',
      status: 'coming-soon',
      semesters: 8
    },
    {
      id: 'mtech',
      name: 'Master of Technology',
      shortName: 'MTech',
      description: 'Advanced degree focusing on specialized areas of computer science and technology',
      status: 'coming-soon',
      semesters: 4
    }
  ];

  return (
    <AppLayout title="Courses" showBackButton={false}>
      <Container className="py-8 animate-fade-in max-w-2xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold animate-slide-down">Available Courses</h2>
          <p className="text-muted-foreground animate-slide-up mt-2">
            Select a course to view semesters and subjects
          </p>
        </div>
        
        <CourseList courses={courses} />
      </Container>
    </AppLayout>
  );
};

export default Courses;
