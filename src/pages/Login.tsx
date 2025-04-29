
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/layout/Container';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/use-auth';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const redirectPath = location.state?.from || '/courses';
  
  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      try {
        console.log("User is authenticated, redirecting to:", redirectPath);
        navigate(redirectPath, { replace: true });
      } catch (error) {
        console.error('Navigation error:', error);
        navigate('/courses', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, redirectPath]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Container maxWidth="xs" className="max-w-xs">
        <div className="text-center mb-3">
          <h1 className="text-xl font-bold text-foreground animate-slide-down">Welcome Back</h1>
          <p className="text-muted-foreground mt-1 animate-slide-up text-sm">
            Sign in to access your study materials
          </p>
        </div>
        <div className="w-full mx-auto">
          <div className="glass-card">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-3 text-center">Login to your account</h2>
              <LoginForm redirectPath={redirectPath} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
