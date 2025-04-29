
import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/layout/Container';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 animate-fade-in">
      <Container maxWidth="md" className="text-center">
        <h1 className="text-9xl font-bold text-primary/20 animate-slide-down">404</h1>
        <h2 className="text-3xl font-bold mt-4 animate-slide-up">Page Not Found</h2>
        <p className="text-muted-foreground mt-4 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Link to="/" className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </Container>
    </div>
  );
};

export default NotFound;
