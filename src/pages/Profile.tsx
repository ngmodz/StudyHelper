import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/layout/Container';
import { AppLayout } from '@/components/ui/layout/AppLayout';
import { BookOpen, Settings, Key, LogOut, Download, UserIcon, Bookmark, UserCog, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileMenuItem from '@/components/profile/ProfileMenuItem';
import ChangePasswordDialog from '@/components/profile/ChangePasswordDialog';
import EditProfileDialog from '@/components/profile/EditProfileDialog';
import ContactDeveloperDialog from '@/components/profile/ContactDeveloperDialog';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout, isTeacher } = useAuth();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isContactDeveloperOpen, setIsContactDeveloperOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleChangePassword = () => {
    setIsChangePasswordOpen(true);
  };

  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleContactDeveloper = () => {
    setIsContactDeveloperOpen(true);
  };

  const formatJoinDate = () => {
    if (!user) return '';
    if (user.id && user.id.startsWith('user-')) {
      const timestamp = user.id.split('-')[1];
      if (timestamp) {
        const date = new Date(parseInt(timestamp));
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      }
    }
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase();
  };

  const getRoleBadgeClass = () => {
    if (isTeacher) {
      return 'role-badge-teacher';
    }
    return 'role-badge-student';
  };

  return (
    <AppLayout title="Profile">
      <Container className="py-6 space-y-8 animate-fade-in">
        <ProfileHeader 
          user={user}
          formatJoinDate={formatJoinDate}
          getUserInitials={getUserInitials}
          getRoleBadgeClass={getRoleBadgeClass}
        />
        
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-medium">Account Settings</h3>
          
          <div className="glass-card overflow-hidden divide-y divide-border/50 dark:divide-white/10">
            <ProfileMenuItem
              icon={UserCog}
              title="Edit Profile"
              description="Update your personal information"
              onClick={handleEditProfile}
            />
            
            <ProfileMenuItem
              icon={BookOpen}
              title="My Courses"
              description="View your enrolled courses"
              onClick={() => navigate('/courses')}
            />
            
            <ProfileMenuItem
              icon={Bookmark}
              title="Bookmarked Notes"
              description="Access your saved notes"
              onClick={() => navigate('/bookmarks')}
            />
            
            <ProfileMenuItem
              icon={Download}
              title="Downloaded Notes"
              description="Access your offline materials"
              onClick={() => navigate('/downloads')}
            />
            
            <ProfileMenuItem
              icon={Settings}
              title="App Settings"
              description="Customize app appearance"
              onClick={() => navigate('/settings')}
            />
            
            <ProfileMenuItem
              icon={Key}
              title="Change Password"
              description="Update your account password"
              onClick={handleChangePassword}
            />
            
            <ProfileMenuItem
              icon={MessageCircle}
              title="Contact Developer"
              description="Get help or provide feedback"
              onClick={handleContactDeveloper}
            />
            
            <ProfileMenuItem
              icon={LogOut}
              title="Logout"
              description="Sign out of your account"
              onClick={handleLogout}
              variant="destructive"
            />
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-6">
          <p>Study Helper App v1.0.0</p>
          <p className="mt-1">© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </Container>
      
      <ChangePasswordDialog isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
      <EditProfileDialog isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
      <ContactDeveloperDialog isOpen={isContactDeveloperOpen} onClose={() => setIsContactDeveloperOpen(false)} />
    </AppLayout>
  );
};

export default Profile;
