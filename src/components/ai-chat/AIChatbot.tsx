
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatButton from './ChatButton';
import ChatDialog from './ChatDialog';

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const [isPWA, setIsPWA] = useState(false);
  
  // Hide chatbot on login and register pages
  const hideOnPaths = ['/', '/login', '/register', '/forgot-password'];
  const shouldShow = !hideOnPaths.includes(location.pathname);

  useEffect(() => {
    // Check if the app is running in PWA mode
    const checkPWAMode = () => {
      const isPWAMode = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true || 
                       document.documentElement.getAttribute('data-app-mode') === 'standalone';
      setIsPWA(isPWAMode);
    };
    
    checkPWAMode();
    
    // Add a small delay before showing the button for animation
    const timer = setTimeout(() => {
      setIsVisible(shouldShow);
    }, 300);

    // Listen for changes in display mode (if user installs PWA mid-session)
    const displayModeHandler = () => {
      checkPWAMode();
    };
    
    window.addEventListener('appinstalled', displayModeHandler);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', displayModeHandler);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('appinstalled', displayModeHandler);
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', displayModeHandler);
    };
  }, [shouldShow]);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  // Don't render on restricted paths or if not yet visible
  if (!isVisible || !shouldShow) return null;

  // For PWA mode on iOS, we might want to adjust the positioning
  const pwaClass = isPWA ? 'pwa-mode' : '';

  return (
    <>
      <ChatButton isOpen={isOpen} onClick={toggleChat} />
      <ChatDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

export default AIChatbot;
