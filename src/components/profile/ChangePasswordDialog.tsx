
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ChangePasswordForm from './ChangePasswordForm';

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95%] max-w-[425px] p-4 sm:p-6 rounded-lg">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl sm:text-2xl text-center sm:text-left">Change Password</DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-center sm:text-left">
            Update your account password. After saving, you'll be logged in with your new password.
          </DialogDescription>
        </DialogHeader>
        <ChangePasswordForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
