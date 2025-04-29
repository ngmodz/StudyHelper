
export type CourseStatus = 'available' | 'coming-soon';

export interface Course {
  id: string;
  name: string;
  shortName: string;
  description: string;
  status: CourseStatus;
  semesters: number;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  courseId: string;
  semesterId: number;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  uploadDate: string;
  uploadedBy: string;
  subjectId: string;
  semesterId: number;
  courseId: string;
  isOwnUpload?: boolean;
  cachedBlobUrl?: string; // Added this optional property for file caching in PWA mode
}

export interface UploadNoteFormData {
  title: string;
  description: string;
  file: File | null;
}
