
import React, { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Key, Loader2 } from 'lucide-react';

interface ChangePasswordFormProps {
  onClose: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const { toast } = useToast();
  
  // Create refs for the form elements
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const validateForm = () => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    let isValid = true;

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle key press events for form navigation with validation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, fieldType: 'currentPassword' | 'newPassword' | 'confirmPassword') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const validateField = (field: string, minLength: number = 0): boolean => {
        if (!field) {
          return false;
        }
        if (minLength > 0 && field.length < minLength) {
          return false;
        }
        return true;
      };
      
      if (fieldType === 'currentPassword') {
        if (!validateField(currentPassword)) {
          setErrors(prev => ({...prev, currentPassword: 'Current password is required'}));
          return;
        }
        setErrors(prev => ({...prev, currentPassword: ''}));
        newPasswordRef.current?.focus();
      } 
      else if (fieldType === 'newPassword') {
        if (!validateField(newPassword, 8)) {
          setErrors(prev => ({...prev, newPassword: newPassword ? 'Password must be at least 8 characters' : 'New password is required'}));
          return;
        }
        setErrors(prev => ({...prev, newPassword: ''}));
        confirmPasswordRef.current?.focus();
      } 
      else if (fieldType === 'confirmPassword') {
        if (!validateField(confirmPassword)) {
          setErrors(prev => ({...prev, confirmPassword: 'Please confirm your new password'}));
          return;
        }
        if (newPassword !== confirmPassword) {
          setErrors(prev => ({...prev, confirmPassword: 'Passwords do not match'}));
          return;
        }
        setErrors(prev => ({...prev, confirmPassword: ''}));
        submitButtonRef.current?.click();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-1">
        <Label htmlFor="current-password" className="text-sm font-medium">Current Password</Label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            if (errors.currentPassword) setErrors(prev => ({...prev, currentPassword: ''}));
          }}
          onKeyDown={(e) => handleKeyDown(e, 'currentPassword')}
          placeholder="Enter your current password"
          className={`w-full text-base sm:text-sm ${errors.currentPassword ? 'border-destructive' : ''}`}
          ref={currentPasswordRef}
        />
        {errors.currentPassword && (
          <p className="text-xs sm:text-sm text-destructive mt-1">{errors.currentPassword}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            if (errors.newPassword) setErrors(prev => ({...prev, newPassword: ''}));
          }}
          onKeyDown={(e) => handleKeyDown(e, 'newPassword')}
          placeholder="Enter your new password"
          className={`w-full text-base sm:text-sm ${errors.newPassword ? 'border-destructive' : ''}`}
          ref={newPasswordRef}
        />
        {errors.newPassword && (
          <p className="text-xs sm:text-sm text-destructive mt-1">{errors.newPassword}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors(prev => ({...prev, confirmPassword: ''}));
          }}
          onKeyDown={(e) => handleKeyDown(e, 'confirmPassword')}
          placeholder="Confirm your new password"
          className={`w-full text-base sm:text-sm ${errors.confirmPassword ? 'border-destructive' : ''}`}
          ref={confirmPasswordRef}
        />
        {errors.confirmPassword && (
          <p className="text-xs sm:text-sm text-destructive mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          className="w-full sm:w-auto order-1 sm:order-none"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full sm:w-auto"
          ref={submitButtonRef}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating
            </>
          ) : (
            <>
              <Key className="mr-2 h-4 w-4" /> Update Password
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
