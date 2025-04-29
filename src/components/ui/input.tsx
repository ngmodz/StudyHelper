import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const isHandlingAutofill = React.useRef(false);
    
    React.useEffect(() => {
      // Merge refs
      if (ref) {
        if (typeof ref === 'function') {
          ref(inputRef.current);
        } else {
          ref.current = inputRef.current;
        }
      }
      
      // Handle autofill detection
      const input = inputRef.current;
      if (!input) return;
      
      // Improved autofill detection and handling
      const handleAutofill = () => {
        if (isHandlingAutofill.current) return;
        isHandlingAutofill.current = true;
        
        try {
          // Force input to dispatch an input event when autofilled
          if (input.value) {
            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);
            
            // Also trigger a change event to update React state
            const changeEvent = new Event('change', { bubbles: true });
            input.dispatchEvent(changeEvent);
          }
        } finally {
          isHandlingAutofill.current = false;
        }
      };
      
      // Animation event for webkit browsers
      const animationStartHandler = (e: AnimationEvent) => {
        if (e.animationName === 'onAutoFillStart') {
          // Slight delay to ensure the browser has populated the field
          setTimeout(handleAutofill, 10);
        }
      };
      
      // Listen for Enter key when input is autofilled
      const keydownHandler = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && input.form) {
          e.preventDefault();
          
          // Find the submit button in the form
          const submitButton = input.form.querySelector('button[type="submit"]');
          if (submitButton instanceof HTMLButtonElement) {
            submitButton.click();
          }
        }
      };
      
      // Add event listeners
      input.addEventListener('animationstart', animationStartHandler);
      input.addEventListener('keydown', keydownHandler);
      
      // Cleanup
      return () => {
        input.removeEventListener('animationstart', animationStartHandler);
        input.removeEventListener('keydown', keydownHandler);
      };
    }, [ref]);
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={inputRef}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
