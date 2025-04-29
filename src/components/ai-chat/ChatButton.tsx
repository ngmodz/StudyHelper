
import React from 'react';
import { MessageCircle, X, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function ChatButton({ isOpen, onClick }: ChatButtonProps) {
  const isMobile = useMobile();
  
  return (
    <div 
      className={cn(
        "fixed z-50 animate-scale-in",
        isMobile ? "bottom-6 right-6" : "bottom-4 right-4"
      )} 
      style={{ 
        animationDelay: '0.5s',
        // Ensure the button doesn't get covered by safe area on iOS devices
        bottom: isMobile ? 'calc(1.5rem + env(safe-area-inset-bottom, 0))' : '1rem'
      }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onClick}
              className={cn(
                "rounded-full aspect-square shadow-lg",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                "transition-all duration-300",
                !isMobile && "hover:scale-105",
                "active:scale-95",
                "ring-2 ring-primary/30 dark:ring-primary/20",
                isMobile ? "w-14 h-14" : "w-12 h-12",
                isOpen ? "" : "animate-pulse-light"
              )}
              aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
            >
              {isOpen ? (
                <X className={cn(isMobile ? "h-5 w-5" : "h-5 w-5")} />
              ) : (
                <Bot className={cn(isMobile ? "h-6 w-6" : "h-5 w-5")} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isMobile ? "top" : "left"} className="font-medium">
            {isOpen ? "Close AI chat" : "Chat with AI Assistant"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default ChatButton;
