
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/layout/Container';
import { AppLayout } from '@/components/ui/layout/AppLayout';
import SemesterList from '@/components/course/SemesterList';
import { Course } from '@/types/course';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  
  // Mock data for courses
  const courses: Record<string, Course> = {
    'bca': {
      id: 'bca',
      name: 'Bachelor of Computer Applications',
      shortName: 'BCA',
      description: 'Comprehensive program covering programming, web development, and software engineering',
      status: 'available',
      semesters: 6
    }
  };
  
  const course = courses[courseId || ''];
  
  if (!course) {
    return (
      <AppLayout title="Course Not Found">
        <Container className="py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Course Not Found</h2>
            <p className="text-muted-foreground">The course you are looking for does not exist.</p>
          </div>
        </Container>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout title={course.shortName}>
      <Container className="py-6 space-y-6 animate-fade-in">
        <div className="mb-6">
          <h2 className="text-2xl font-bold animate-slide-down mb-2">{course.name}</h2>
          <p className="text-muted-foreground animate-slide-up">{course.description}</p>
        </div>
        
        <SemesterList 
          courseId={course.id} 
          semesterCount={course.semesters} 
        />
      </Container>
    </AppLayout>
  );
};

export default CourseDetail;
