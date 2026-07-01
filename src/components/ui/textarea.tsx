import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full border-2 border-[#2d2d2d] bg-[#1a1a1a] px-3 py-2 text-sm font-mono text-[#f0f0f0] transition-colors placeholder:text-[#555] focus-visible:outline-none focus-visible:border-[#FF9900] focus-visible:shadow-[2px_2px_0_0_#FF9900] disabled:cursor-not-allowed disabled:opacity-40',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
