import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/layout/Container';
import { useAuth } from '@/hooks/use-auth';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  
  // Create refs for the form elements
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/courses');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    
    // Validate email before submission
    if (!validateEmail(email)) {
      setEmailError("Please include an '@' in the email address.");
      emailRef.current?.focus();
      return;
    }
    
    // Validate password length
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      passwordRef.current?.focus();
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log(`Registering with: ${email}, ${name}, ${role}`);
      await register(email, password, name, role);
      navigate('/courses');
    } catch (error) {
      console.error('Registration error:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Please check your information and try again";
      
      setGeneralError(errorMessage);
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Email validation function
  const validateEmail = (email: string): boolean => {
    return email.includes('@');
  };

  // Handle email change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Clear error when user starts typing again
    if (emailError) {
      setEmailError('');
    }
  };

  // Handle password change with validation
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Clear error when user starts typing again
    if (passwordError) {
      setPasswordError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle key press events for form navigation with validation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, fieldType: 'name' | 'email' | 'password' | 'confirmPassword') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (fieldType === 'name' && emailRef.current) {
        emailRef.current.focus();
      } else if (fieldType === 'email') {
        // Validate email before allowing navigation to password field
        if (!validateEmail(email)) {
          setEmailError("Please include an '@' in the email address.");
          return;
        }
        
        // Clear any previous error and move to password field
        setEmailError('');
        passwordRef.current?.focus();
      } else if (fieldType === 'password') {
        // Validate password before allowing navigation to confirm password field
        if (password.length < 6) {
          setPasswordError("Password must be at least 6 characters long.");
          return;
        }
        
        // Clear any previous error and move to confirm password field
        setPasswordError('');
        confirmPasswordRef.current?.focus();
      } else if (fieldType === 'confirmPassword' && submitButtonRef.current) {
        submitButtonRef.current.click();
      }
    }
  };

  // Handle role change
  const handleRoleChange = (value: string) => {
    setRole(value as 'student' | 'teacher');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Container maxWidth="xs" className="max-w-xs">
        <div className="text-center mb-3">
          <h1 className="text-xl font-bold text-foreground animate-slide-down">Create Account</h1>
          <p className="text-muted-foreground mt-1 animate-slide-up text-sm">Join our learning platform</p>
        </div>
        <div className="w-full mx-auto">
          <div className="glass-card">
            <div className="p-4">
              {generalError && (
                <Alert variant="destructive" className="mb-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{generalError}</AlertDescription>
                </Alert>
              )}
              
              <form className="space-y-2" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground" htmlFor="name">Full Name</label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <input 
                      ref={nameRef}
                      type="text" 
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&:-webkit-autofill]:bg-background [&:-webkit-autofill]:text-foreground [&:-webkit-autofill]:caret-black [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_var(--background)_inset] caret-black focus:caret-black pl-9 input-focus-ring h-9 text-foreground" 
                      id="name" 
                      placeholder="Enter your full name" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'name')}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground" htmlFor="email">Email</label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                    <input 
                      ref={emailRef}
                      type="email" 
                      className={`flex w-full rounded-md border ${emailError ? 'border-destructive' : 'border-input'} bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&:-webkit-autofill]:bg-background [&:-webkit-autofill]:text-foreground [&:-webkit-autofill]:caret-black [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_var(--background)_inset] caret-black focus:caret-black pl-9 input-focus-ring h-9 text-foreground`}
                      id="email" 
                      placeholder="Enter your email" 
                      required
                      value={email}
                      onChange={handleEmailChange}
                      onKeyDown={(e) => handleKeyDown(e, 'email')}
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
                    <input 
                      ref={passwordRef}
                      type={showPassword ? "text" : "password"} 
                      className={`flex w-full rounded-md border ${passwordError ? 'border-destructive' : 'border-input'} bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&:-webkit-autofill]:bg-background [&:-webkit-autofill]:text-foreground [&:-webkit-autofill]:caret-black [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_var(--background)_inset] caret-black focus:caret-black pl-9 pr-9 input-focus-ring h-9 text-foreground`} 
                      id="password" 
                      placeholder="Enter your password" 
                      required
                      value={password}
                      onChange={handlePasswordChange}
                      onKeyDown={(e) => handleKeyDown(e, 'password')}
                      disabled={isLoading}
                      aria-invalid={passwordError ? "true" : "false"}
                      aria-describedby={passwordError ? "password-error" : undefined}
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <Alert variant="destructive" className="py-2 px-3 mt-1">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription id="password-error" className="text-xs ml-2">
                        {passwordError}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <input 
                      ref={confirmPasswordRef}
                      type={showConfirmPassword ? "text" : "password"} 
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&:-webkit-autofill]:bg-background [&:-webkit-autofill]:text-foreground [&:-webkit-autofill]:caret-black [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_var(--background)_inset] caret-black focus:caret-black pl-9 pr-9 input-focus-ring h-9 text-foreground" 
                      id="confirmPassword" 
                      placeholder="Confirm your password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'confirmPassword')}
                      disabled={isLoading}
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium">Select your role</label>
                  
                  <RadioGroup
                    value={role}
                    onValueChange={handleRoleChange}
                    className="flex gap-6 mt-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium" htmlFor="student">Student</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="teacher" id="teacher" />
                      <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium" htmlFor="teacher">Teacher</label>
                    </div>
                  </RadioGroup>
                </div>
                <Button 
                  ref={submitButtonRef}
                  type="submit" 
                  className="w-full h-9 text-sm font-medium mt-1" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="w-4 h-4 border-2 border-white border-opacity-20 border-t-white rounded-full animate-spin mr-2"></span>
                      Creating account...
                    </span>
                  ) : "Create account"}
                </Button>
              </form>
              <div className="mt-2 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account? <a 
                    className="text-primary hover:underline font-medium text-sm" 
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/');
                    }}
                  >
                    Login
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Register;
