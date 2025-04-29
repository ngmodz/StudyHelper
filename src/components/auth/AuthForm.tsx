
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export type FormType = 'login' | 'register';

interface AuthFormProps {
  className?: string;
  formType?: FormType;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  className,
  formType = 'login'
}) => {
  const [currentFormType, setCurrentFormType] = useState<FormType>(formType);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (currentFormType === 'login') {
        await login(email, password);
        toast({
          title: "Login successful",
          description: "Welcome back to the platform!"
        });
        navigate('/courses');
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }
        
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        
        console.log(`Attempting to register with: ${email}, ${name}, ${role}`);
        await register(email, password, name, role);
        
        toast({
          title: "Registration successful",
          description: "Your account has been created successfully!"
        });
        navigate('/courses');
      }
    } catch (error) {
      console.error('Auth error:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred";
      
      setError(errorMessage);
      
      toast({
        title: currentFormType === 'login' ? "Login failed" : "Registration failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full mx-auto", className)}>
      <div className="glass-card">
        <div className="p-4">
          {currentFormType === 'login' ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <h2 className="text-lg font-semibold mb-3 text-center text-foreground">Login to your account</h2>
              
              <div className="space-y-1">
                <Label htmlFor="email" className="text-foreground text-sm">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    className="pl-9 input-focus-ring h-9 text-foreground" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="password" className="text-foreground text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    className="pl-9 pr-9 input-focus-ring h-9 text-foreground" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe} 
                    onCheckedChange={(checked) => setRememberMe(checked === true)} 
                    className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
                  />
                  <label 
                    htmlFor="remember" 
                    className="text-sm font-normal text-foreground"
                  >
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-primary hover:underline text-sm font-normal">
                  Forgot password?
                </a>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-9 text-sm font-medium" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="w-4 h-4 border-2 border-white border-opacity-20 border-t-white rounded-full animate-spin mr-2"></span>
                    Logging in...
                  </span>
                ) : 'Login'}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary hover:underline font-medium text-sm">
                    Register
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <h2 className="text-lg font-semibold mb-3 text-center text-foreground">Create a new account</h2>
              
              <div className="space-y-1">
                <Label htmlFor="name" className="text-foreground text-sm">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Enter your full name" 
                    className="pl-9 input-focus-ring h-9 text-foreground" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="email" className="text-foreground text-sm">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    className="pl-9 input-focus-ring h-9 text-foreground" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="password" className="text-foreground text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    className="pl-9 pr-9 input-focus-ring h-9 text-foreground" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-foreground text-sm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirm your password" 
                    className="pl-9 pr-9 input-focus-ring h-9 text-foreground" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-foreground text-sm">Select your role</Label>
                <div className="flex items-center gap-4 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={role === 'student'}
                      onChange={() => setRole('student')}
                      className="h-4 w-4 text-primary accent-primary"
                    />
                    <span className="text-foreground text-sm">Student</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role" 
                      value="teacher"
                      checked={role === 'teacher'}
                      onChange={() => setRole('teacher')}
                      className="h-4 w-4 text-primary accent-primary"
                    />
                    <span className="text-foreground text-sm">Teacher</span>
                  </label>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-9 text-sm font-medium" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="w-4 h-4 border-2 border-white border-opacity-20 border-t-white rounded-full animate-spin mr-2"></span>
                    Creating account...
                  </span>
                ) : 'Create account'}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium text-sm">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
