
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [contactDetails, setContactDetails] = useState(user?.contactDetails || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Reset form state when dialog opens/closes or user changes
  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setContactDetails(user.contactDetails || '');
      setIsEmailChanged(false);
      setVerificationSent(false);
      setVerificationCode('');
    }
  }, [isOpen, user]);
  
  // Track if email has been changed
  useEffect(() => {
    if (user && email !== user.email) {
      setIsEmailChanged(true);
      setVerificationSent(false);
    } else {
      setIsEmailChanged(false);
    }
  }, [email, user]);
  
  const handleSendVerification = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API endpoint to send verification email
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network request
      
      // Generate a 6-digit verification code (in a real app, this would be sent via email)
      const mockVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('Verification code (for demo):', mockVerificationCode); // For testing purposes
      
      setVerificationSent(true);
      
      toast({
        title: "Verification code sent",
        description: "Check your email for the verification code",
      });
    } catch (error) {
      toast({
        title: "Failed to send verification code",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerifyEmail = async () => {
    setIsVerifying(true);
    
    try {
      // In a real app, this would validate the code with a backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network request
      
      // For demo purposes, any 6-digit code is accepted
      if (verificationCode.length === 6) {
        toast({
          title: "Email verified",
          description: "Your email has been verified successfully",
        });
        setIsEmailChanged(false);
      } else {
        throw new Error("Invalid verification code");
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Invalid verification code. Please try again",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Prevent submission if email is changed but not verified
    if (isEmailChanged && !verificationSent) {
      toast({
        title: "Email verification required",
        description: "Please verify your new email address before saving",
        variant: "destructive",
      });
      return;
    }
    
    // Prevent submission if verification was sent but not completed
    if (verificationSent && isEmailChanged) {
      toast({
        title: "Email verification required",
        description: "Please complete the email verification process",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app this would call an API endpoint
      await updateProfile({ name, email, bio, contactDetails });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: "An error occurred while updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex justify-center mb-6">
            <Avatar className="h-24 w-24">
              {user?.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback className="text-lg">
                  {user?.name?.split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase() || <UserIcon />}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={isEmailChanged ? "border-amber-500" : ""}
              />
              {isEmailChanged && !verificationSent && (
                <Button 
                  type="button" 
                  onClick={handleSendVerification} 
                  disabled={isLoading}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Verify
                </Button>
              )}
            </div>
            {isEmailChanged && (
              <p className="text-xs text-amber-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                Email change requires verification
              </p>
            )}
          </div>
          
          {isEmailChanged && verificationSent && (
            <div className="space-y-2">
              <Alert className="bg-muted/50">
                <AlertDescription className="text-sm">
                  A verification code has been sent to {email}. Please enter the code below to verify your email.
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  maxLength={6}
                  className="font-mono"
                />
                <Button 
                  type="button" 
                  onClick={handleVerifyEmail} 
                  disabled={verificationCode.length !== 6 || isVerifying}
                  size="sm"
                >
                  {isVerifying ? "Verifying..." : "Submit"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                For this demo, any 6-digit code will work.
              </p>
            </div>
          )}
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="contactDetails">Contact Details</Label>
            <Input
              id="contactDetails"
              value={contactDetails}
              onChange={(e) => setContactDetails(e.target.value)}
              placeholder="Phone number or additional contact info"
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || (isEmailChanged && (!verificationSent || (verificationSent && verificationCode.length !== 6)))}
            >
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
