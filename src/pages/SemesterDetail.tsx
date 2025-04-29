import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/layout/Container';
import { AppLayout } from '@/components/ui/layout/AppLayout';
import SubjectCard from '@/components/course/SubjectCard';
import { Subject } from '@/types/course';

const SemesterDetail = () => {
  const { courseId, semesterId } = useParams<{ courseId: string; semesterId: string }>();
  const semesterNumber = parseInt(semesterId || '1');
  
  // Get semester title based on semester number
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
  
  // Get subjects based on semester number
  const getSubjectsBySemester = (semesterNum: number): Subject[] => {
    switch (semesterNum) {
      case 1:
        return [
          {
            id: 'basics-mathematics',
            name: 'Basics of Mathematics',
            description: 'Essential mathematical concepts for computer science and programming',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'web-designing',
            name: 'Web Designing Using HTML, CSS, JavaScript & PHP',
            description: 'Learn the fundamentals of web development with HTML, CSS, JavaScript, and PHP',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'web-design-lab',
            name: 'Web Design Lab',
            description: 'Practical exercises and projects for web development',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'python',
            name: 'Clean Coding with Python',
            description: 'Learn Python programming with focus on clean, maintainable code',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'python-lab',
            name: 'Clean Coding with Python Lab',
            description: 'Hands-on coding exercises and projects using Python',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'software-engineering',
            name: 'Essentials of Software Engineering',
            description: 'Introduction to software development lifecycle, methodologies, and best practices',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'software-engineering-lab',
            name: 'Essentials of Software Engineering Lab',
            description: 'Practical applications of software engineering principles',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'environmental-studies',
            name: 'Environmental Studies & Disaster Management',
            description: 'Understanding environmental issues and disaster management strategies',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'data-visualization',
            name: 'Data Visualization using Power BI',
            description: 'Creating insightful visualizations and dashboards with Power BI',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          }
        ];
      case 2:
        return [
          {
            id: 'oop-cpp',
            name: 'Fundamentals of Object-Oriented Programming using C++',
            description: 'Learn object-oriented programming concepts using C++',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'oop-lab',
            name: 'Object-Oriented Programming Lab using C++',
            description: 'Hands-on exercises implementing object-oriented programming in C++',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'discrete-structure',
            name: 'Discrete Structure',
            description: 'Mathematical foundations for computer science and logical problem solving',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'ai-ethics',
            name: 'Overview of AI, Data Science, Ethics, and Foundation of Data Analysis',
            description: 'Ethical considerations in AI and data science applications',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'ai-ethics-lab',
            name: 'Overview of AI, Data Science, Ethics, and Foundation of Data Analysis Lab',
            description: 'Practical applications of AI and data science ethics',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'r-programming',
            name: 'R Programming for Data Science and Data Analytics Lab',
            description: 'Practical data analysis using R programming language',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'open-elective-1',
            name: 'Open Elective – I',
            description: 'Elective course from other disciplines to broaden knowledge',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          }
        ];
      case 3:
        return [
          {
            id: 'data-structures',
            name: 'Fundamentals of Data Structures',
            description: 'Essential data structures and their implementation',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'data-structures-lab',
            name: 'Fundamentals of Data Structures Lab',
            description: 'Practical implementation of various data structures',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'java-programming',
            name: 'Fundamentals of Java Programming',
            description: 'Java programming fundamentals for application development',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'java-lab',
            name: 'Fundamentals of Java Programming Lab',
            description: 'Hands-on Java programming exercises',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'probabilistic-modelling',
            name: 'Probabilistic Modelling and Reasoning',
            description: 'Statistical foundations for AI and machine learning',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'ai-fundamentals',
            name: 'Fundamentals of Artificial Intelligence',
            description: 'Core concepts and approaches in artificial intelligence',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'open-elective-2',
            name: 'Open Elective - II',
            description: 'Second elective course from other disciplines',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'life-skills-1',
            name: 'Life Skills for Professionals – I',
            description: 'Essential soft skills for professional development',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'vac-1',
            name: 'VAC-I',
            description: 'Value Added Course I',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          }
        ];
      case 4:
        return [
          {
            id: 'operating-systems',
            name: 'Fundamentals of Operating Systems',
            description: 'Core concepts of operating systems design and implementation',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'operating-systems-lab',
            name: 'Fundamentals of Operating System Lab',
            description: 'Hands-on implementation of operating system concepts',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'dbms',
            name: 'Fundamentals of Database Management Systems',
            description: 'Database design, implementation, and management',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'dbms-lab',
            name: 'Fundamentals of Database Management Systems Lab',
            description: 'Practical database design and implementation exercises',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'machine-learning',
            name: 'Foundation of Machine Learning',
            description: 'Fundamental concepts and algorithms in machine learning',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'ml-lab',
            name: 'Foundation of Machine Learning Lab',
            description: 'Practical implementation of machine learning algorithms',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'big-data-lab',
            name: 'Big Data Analysis with Scala and Spark Lab',
            description: 'Practical implementation of big data technologies',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'open-elective-3',
            name: 'Open Elective - III',
            description: 'Third elective course from other disciplines',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'life-skills-2',
            name: 'Life Skills for Professionals – II',
            description: 'Advanced soft skills for professional development',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          }
        ];
      case 5:
        return [
          {
            id: 'algorithms',
            name: 'Design and Analysis of Algorithms',
            description: 'Techniques for designing and analyzing efficient algorithms',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'algorithms-lab',
            name: 'Design & Analysis of Algorithms Lab',
            description: 'Implementing and analyzing algorithms in practice',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'automata',
            name: 'Theory of Automata',
            description: 'Theoretical foundations of computer science and computational models',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'nlp',
            name: 'Introduction to Natural Language Processing',
            description: 'Fundamentals of processing and analyzing human language',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'nlp-lab',
            name: 'Introduction to Natural Language Processing Lab',
            description: 'Hands-on natural language processing exercises',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'data-science-lab',
            name: 'Data Science - Tools and Techniques Lab',
            description: 'Practical application of data science methodologies',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'life-skills-3',
            name: 'Life Skills for Professionals - III',
            description: 'Advanced professional development skills',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          }
        ];
      case 6:
        return [
          {
            id: 'computer-architecture',
            name: 'Introduction to Computer Organization & Architecture',
            description: 'Hardware components and design of computer systems',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'networks',
            name: 'Introduction to Computer Networks',
            description: 'Fundamentals of networking principles and protocols',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'networks-lab',
            name: 'Introduction to Computer Networks Lab',
            description: 'Practical implementation of networking concepts',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'neural-networks',
            name: 'Basics of Neural Networks and Deep Learning',
            description: 'Foundations of neural networks and deep learning architectures',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'neural-networks-lab',
            name: 'Basics of Neural Networks and Deep Learning Lab',
            description: 'Hands-on implementation of deep learning models',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'dept-elective-1',
            name: 'Department Elective I',
            description: 'Specialized elective course within computer science',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'dept-elective-lab',
            name: 'Department Elective I Lab',
            description: 'Practical exercises related to department elective',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          },
          {
            id: 'minor-project',
            name: 'Minor Project - III',
            description: 'Capstone project applying concepts learned throughout the program',
            courseId: courseId || 'bca',
            semesterId: semesterNum
          }
        ];
      default:
        return [];
    }
  };
  
  const subjects = getSubjectsBySemester(semesterNumber);
  
  return (
    <AppLayout title={`Semester ${semesterNumber}`}>
      <Container className="py-6 space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold animate-slide-down">Semester {semesterNumber}</h2>
          <p className="text-muted-foreground animate-slide-up">{getSemesterTitle(semesterNumber)}</p>
        </div>
        
        <div className="grid gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">No subjects available for this semester.</p>
            </div>
          )}
        </div>
      </Container>
    </AppLayout>
  );
};

export default SemesterDetail;
