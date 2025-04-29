
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Container } from '@/components/ui/layout/Container';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, this would call your auth provider's password reset API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Reset link sent",
        description: "Please check your email for password reset instructions",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c1220]">
      <Container maxWidth="xs" className="max-w-xs">
        <div className="text-center mb-3">
          <h1 className="text-xl font-bold text-foreground animate-slide-down">Reset Password</h1>
          <p className="text-muted-foreground mt-1 animate-slide-up text-sm">
            Enter your email to receive reset instructions
          </p>
        </div>
        <div className="w-full mx-auto">
          <div className="glass-card">
            <div className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                    Email
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      className="w-full"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-primary hover:underline text-sm"
                    onClick={() => navigate('/')}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ForgotPassword;
