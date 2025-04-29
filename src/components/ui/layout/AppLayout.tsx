
import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Header from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  showBackButton = true,
  showHeader = true,
  showFooter = true,
  className
}) => {
  const location = useLocation();
  const isRootPath = location.pathname === '/';
  const isSubjectDetailPage = location.pathname.includes('/subjects/');
  
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      {showHeader && (
        <Header 
          title={title}
          showBackButton={showBackButton}
          isRootPath={isRootPath}
          isSubjectDetailPage={isSubjectDetailPage}
        />
      )}

      <main className={cn(
        "flex-1 w-full overflow-y-auto -webkit-overflow-scrolling-touch pb-safe", 
        className
      )}>
        {children}
      </main>

      {showFooter && (
        <div className="pb-safe"></div>
      )}
    </div>
  );
};

export default AppLayout;
