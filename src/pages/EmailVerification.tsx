
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container } from '@/components/ui/layout/Container';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';

const EmailVerification = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the access token from URL
        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = params.get('access_token');
        
        if (!accessToken) {
          setError('No verification token found in URL');
          setIsProcessing(false);
          return;
        }
        
        console.log('Found access token, verifying email...');
        const { error } = await supabase.auth.getUser(accessToken);
        
        if (error) {
          setError('Email verification failed: ' + error.message);
          console.error('Email verification error:', error);
          toast({
            title: "Verification Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          setIsVerified(true);
          console.log('Email verification successful');
          toast({
            title: "Email Verified",
            description: "Your email has been verified successfully!",
            variant: "default"
          });
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } catch (err) {
        console.error('Error during email verification:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsProcessing(false);
      }
    };

    handleEmailVerification();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Container maxWidth="sm">
        <div className="glass-card p-8">
          <div className="text-center">
            {isProcessing ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <h1 className="text-xl font-bold mb-2">Verifying your email...</h1>
                <p className="text-muted-foreground">Please wait while we verify your email address.</p>
              </>
            ) : isVerified ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h1 className="text-xl font-bold mb-2">Email Verified Successfully!</h1>
                <p className="text-muted-foreground mb-4">Your email has been verified. You will be redirected to the login page shortly.</p>
                <Button onClick={() => navigate('/')}>Go to Login</Button>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-red-100 rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <h1 className="text-xl font-bold mb-2">Verification Failed</h1>
                <p className="text-muted-foreground mb-4">{error || 'An error occurred during email verification.'}</p>
                <Button onClick={() => navigate('/')}>Go to Login</Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EmailVerification;
