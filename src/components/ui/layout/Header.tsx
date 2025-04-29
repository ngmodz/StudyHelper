
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, Bookmark } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  isRootPath: boolean;
  isSubjectDetailPage: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  isRootPath,
  isSubjectDetailPage
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-morphism sticky top-0 z-10 border-b">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center space-x-4">
          {showBackButton && !isRootPath && (
            <Link 
              to={-1 as any} 
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground transition-colors hover:bg-secondary hover-lift-sm"
            >
              <ArrowLeft size={20} />
            </Link>
          )}
          <h1 className="text-lg font-medium">
            {isSubjectDetailPage ? "Notes" : title}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Link 
            to="/bookmarks" 
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground transition-colors hover:bg-secondary hover-lift-sm" 
            aria-label="Bookmarks"
          >
            <Bookmark size={20} />
          </Link>
          <Link 
            to="/profile" 
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground transition-colors hover:bg-secondary hover-lift-sm" 
            aria-label="Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
          </Link>
          <button 
            onClick={handleLogout} 
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground transition-colors hover:bg-secondary hover-lift-sm"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
