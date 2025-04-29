import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  redirectPath?: string;
}

const LoginForm = ({ redirectPath = '/courses' }: LoginFormProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    try {
      const storedEmail = localStorage.getItem('rememberedEmail');
      const storedPassword = localStorage.getItem('rememberedPassword');
      
      if (storedEmail && storedPassword) {
        setEmail(storedEmail);
        setPassword(storedPassword);
        setRememberMe(true);
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setEmailError("Please include an '@' in the email address.");
      emailRef.current?.focus();
      return;
    }
    
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (rememberMe) {
        try {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPassword', password);
        } catch (error) {
          console.error('Error saving credentials:', error);
        }
      } else {
        try {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        } catch (error) {
          console.error('Error removing credentials:', error);
        }
      }
      
      await login(email, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setError("Login failed. Please check your credentials and try again.");
      
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email: string): boolean => {
    return email.includes('@');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    if (emailError) {
      setEmailError('');
    }
    if (error) {
      setError(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) {
      setError(null);
    }
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (!validateEmail(email)) {
        setEmailError("Please include an '@' in the email address.");
        return;
      }
      
      setEmailError('');
      passwordRef.current?.focus();
    }
  };

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit} ref={formRef} autoComplete="on">
      {error && (
        <Alert variant="destructive" className="py-2 px-3">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs ml-2">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground" htmlFor="email">Email</label>
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </svg>
          <Input 
            ref={emailRef}
            type="email" 
            className={`flex w-full rounded-md border ${emailError ? 'border-destructive' : 'border-input'} px-3 py-2 pl-9 h-9 text-foreground`}
            id="email" 
            name="email"
            autoComplete="email"
            placeholder="Enter your email" 
            required
            value={email}
            onChange={handleEmailChange}
            onKeyDown={handleEmailKeyDown}
            disabled={isLoading}
            aria-invalid={emailError ? "true" : "false"}
            aria-describedby={emailError ? "email-error" : undefined}
          />
        </div>
        {emailError && (
          <Alert variant="destructive" className="py-2 px-3 mt-1">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription id="email-error" className="text-xs ml-2">
              {emailError}
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground" htmlFor="password">Password</label>
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <Input 
            ref={passwordRef}
            type={showPassword ? "text" : "password"} 
            className="flex w-full rounded-md border border-input pl-9 pr-9 h-9 text-foreground" 
            id="password" 
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password" 
            required
            value={password}
            onChange={handlePasswordChange}
            disabled={isLoading}
          />
          <button 
            type="button" 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" 
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={rememberMe} 
            onCheckedChange={handleRememberMeChange}
          />
          <Label htmlFor="remember" className="text-sm font-normal text-foreground">
            Remember me
          </Label>
        </div>
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            try {
              navigate('/forgot-password');
            } catch (navError) {
              console.error('Navigation error:', navError);
            }
          }}
          className="text-primary hover:underline text-sm font-normal bg-transparent border-none p-0"
        >
          Forgot password?
        </button>
      </div>
      
      <Button 
        ref={submitButtonRef}
        type="submit" 
        className="w-full h-9 text-sm font-medium" 
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account? <button 
            type="button"
            className="text-primary hover:underline font-medium text-sm bg-transparent border-none p-0" 
            onClick={(e) => {
              e.preventDefault();
              try {
                navigate('/register');
              } catch (navError) {
                console.error('Navigation error:', navError);
              }
            }}
          >
            Register
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
