
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ProfileMenuItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  variant?: "default" | "destructive";
}

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon: Icon,
  title,
  description,
  onClick,
  variant = "default"
}) => {
  const isDestructive = variant === "destructive";
  
  return (
    <Button 
      variant="ghost" 
      className={`w-full justify-start h-auto p-4 rounded-none ${
        isDestructive ? 'text-destructive hover:text-destructive dark:text-red-400 dark:hover:text-red-300' : ''
      }`} 
      onClick={onClick}
    >
      <Icon className={`h-5 w-5 mr-3 ${isDestructive ? '' : 'text-primary'}`} />
      <div className="text-left">
        <div className="font-medium">{title}</div>
        <div className={`text-sm ${isDestructive ? 'opacity-70' : 'text-muted-foreground'}`}>
          {description}
        </div>
      </div>
    </Button>
  );
};

export default ProfileMenuItem;
