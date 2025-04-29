
import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/layout/Container';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Download, Upload } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background animate-fade-in">
      <main className="flex-1 flex flex-col">
        <section className="py-16 md:py-24 flex-1 flex flex-col justify-center">
          <Container maxWidth="lg" className="space-y-12">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="inline-block rounded-full bg-primary/10 p-2 mb-4 animate-pulse-light">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold animate-slide-down">
                Study Helper App
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up">
                A mobile-first platform for seamless academic note-sharing between teachers and students
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link to="/login">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 pt-8" style={{ animationDelay: '0.5s' }}>
              <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Course Notes</h3>
                <p className="text-muted-foreground">
                  Access organized academic materials for all your courses and semesters.
                </p>
              </div>
              
              <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Teacher & Student</h3>
                <p className="text-muted-foreground">
                  Specialized features for both teachers and students to optimize learning.
                </p>
              </div>
              
              <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Download Notes</h3>
                <p className="text-muted-foreground">
                  Preview and download notes for offline access anytime, anywhere.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <footer className="py-6 border-t">
        <Container>
          <p className="text-center text-muted-foreground">
            © {new Date().getFullYear()} Study Helper App. All rights reserved.
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default Index;
