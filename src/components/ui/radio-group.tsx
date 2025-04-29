
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  // Add a handler for keydown events on the radio group
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // If Enter key is pressed
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Find the closest form and submit it
      const form = (e.currentTarget as HTMLElement).closest('form');
      if (form) {
        // Use setTimeout to ensure state updates have been processed
        setTimeout(() => {
          const submitButton = form.querySelector('button[type="submit"]');
          if (submitButton && 'click' in submitButton) {
            (submitButton as HTMLButtonElement).click();
          } else {
            form.requestSubmit();
          }
        }, 0);
      }
    }
    
    // Call the original onKeyDown if it exists
    if (props.onKeyDown) {
      props.onKeyDown(e as any);
    }
  };

  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
      onKeyDown={handleKeyDown}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  // Add a handler for keydown events on individual radio items
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // If Enter key is pressed
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Trigger the click programmatically
      (e.currentTarget as HTMLButtonElement).click();
      
      // Find the closest form and submit it
      const form = (e.currentTarget as HTMLElement).closest('form');
      if (form) {
        // Use setTimeout to ensure state updates have been processed
        setTimeout(() => {
          const submitButton = form.querySelector('button[type="submit"]');
          if (submitButton && 'click' in submitButton) {
            (submitButton as HTMLButtonElement).click();
          } else {
            form.requestSubmit();
          }
        }, 0);
      }
    }
    
    // Call the original onKeyDown if it exists
    if (props.onKeyDown) {
      props.onKeyDown(e as any);
    }
  };

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
      onKeyDown={handleKeyDown}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
