
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import EmailVerification from '@/pages/EmailVerification';
import Courses from '@/pages/Courses';
import CourseDetail from '@/pages/CourseDetail';
import SemesterDetail from '@/pages/SemesterDetail';
import SubjectDetail from '@/pages/SubjectDetail';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Downloads from '@/pages/Downloads';
import Bookmarks from '@/pages/Bookmarks';
import { AuthProvider } from '@/hooks/use-auth';
import AIChatbot from '@/components/ai-chat/AIChatbot';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="study-helper-theme" enableSystem={true}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            
            {/* Protected Routes */}
            <Route path="/courses" element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            } />
            <Route path="/courses/:courseId" element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            } />
            <Route path="/courses/:courseId/semesters/:semesterId" element={
              <ProtectedRoute>
                <SemesterDetail />
              </ProtectedRoute>
            } />
            <Route path="/courses/:courseId/semesters/:semesterId/subjects/:subjectId" element={
              <ProtectedRoute>
                <SubjectDetail />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/downloads" element={
              <ProtectedRoute>
                <Downloads />
              </ProtectedRoute>
            } />
            <Route path="/bookmarks" element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <AIChatbot />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
