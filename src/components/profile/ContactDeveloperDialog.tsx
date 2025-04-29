import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, User, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import emailjs from '@emailjs/browser';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';

interface ContactDeveloperDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Initialize EmailJS with your public key
emailjs.init("rAWcNXLwC7kNVcsgM");

export const ContactDeveloperDialog: React.FC<ContactDeveloperDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Store the timestamp of the last email sent in localStorage
  const canSendEmail = () => {
    const lastSent = localStorage.getItem('lastEmailSent');
    if (!lastSent) return true;
    
    const timeDiff = Date.now() - parseInt(lastSent);
    return timeDiff > 300000; // 5 minutes cooldown
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (!canSendEmail()) {
      toast({
        title: "Rate limit exceeded",
        description: "Please wait 5 minutes before sending another message.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      await emailjs.send(
        "service_69ndh2b",
        "template_2vhoxri",
        {
          subject: subject,
          message: message,
          from_name: user?.name || "Anonymous",
          to_email: "nishantgrewal2005@gmail.com",
        }
      );
      
      // Update the last sent timestamp
      localStorage.setItem('lastEmailSent', Date.now().toString());
      
      toast({
        title: "Message sent",
        description: "Your message has been sent to the developer. Thank you for your feedback!",
      });
      
      // Reset form and close dialog
      setSubject('');
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Developer</DialogTitle>
          <DialogDescription>
            Send a message to the developer team for help, feedback, or feature requests.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4 p-4 bg-muted/40 rounded-lg border border-border">
          <div className="flex items-center gap-3 mb-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Nishant Grewal</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <a 
              href="mailto:nishantgrewal2005@gmail.com" 
              className="text-primary hover:underline"
            >
              nishantgrewal2005@gmail.com
            </a>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject" className="required">Subject</Label>
            <Input
              id="subject"
              placeholder="Bug report, feature request, question..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="required">Message</Label>
            <Textarea
              id="message"
              placeholder="Describe your issue or suggestion in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSending} 
              className="gap-2 ml-2"
            >
              {isSending ? 'Sending...' : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDeveloperDialog;
