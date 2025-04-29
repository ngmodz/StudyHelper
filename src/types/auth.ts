
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatar?: string;
  bio?: string;
  contactDetails?: string;
  bookmarks?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
