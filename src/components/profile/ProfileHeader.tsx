
import React from 'react';
import { Mail } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@/types/auth';

interface ProfileHeaderProps {
  user: User | null;
  formatJoinDate: () => string;
  getUserInitials: () => string;
  getRoleBadgeClass: () => string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  formatJoinDate,
  getUserInitials,
  getRoleBadgeClass
}) => {
  return (
    <div className="glass-card p-6 flex flex-col items-center text-center animate-scale-in">
      <div className="h-24 w-24 mb-4">
        <Avatar className="h-full w-full bg-white dark:bg-slate-800">
          <AvatarFallback className="text-primary">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      </div>
      <h2 className="text-2xl font-bold">{user?.name || 'User'}</h2>
      <div className="flex items-center text-muted-foreground mt-1">
        <Mail className="h-4 w-4 mr-1" />
        <span>{user?.email || 'email@example.com'}</span>
      </div>
      <div className={getRoleBadgeClass() + " mt-2 capitalize"}>
        {user?.role || 'student'}
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        Joined on {formatJoinDate()}
      </p>
    </div>
  );
};

export default ProfileHeader;
