
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [showDialog, setShowDialog] = React.useState(false);
  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowDialog(true);
      // Increased timeout to give users time to see the dialog (from 500ms to 2500ms)
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated]);

  // If still loading auth state, don't render anything yet to prevent flash
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">Loading...</div>
    </div>;
  }

  // If authenticated, render the children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Handle dialog closing
  const handleDialogClose = () => {
    setShowDialog(false);
    setShouldRedirect(true);
  };

  // If not authenticated, show dialog and prepare for redirect
  return (
    <>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Please log in to continue</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to access this page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button 
              onClick={handleDialogClose}
              className="w-full"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Go to Login
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {shouldRedirect && (
        <Navigate 
          to="/" 
          state={{ from: location.pathname }}
          replace 
        />
      )}
    </>
  );
};

export default ProtectedRoute;
