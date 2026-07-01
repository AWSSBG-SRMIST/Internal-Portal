import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full border-2 border-[#2d2d2d] bg-[#1a1a1a] px-3 py-1 text-sm font-mono text-[#f0f0f0] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#555] focus-visible:outline-none focus-visible:border-[#FF9900] focus-visible:shadow-[2px_2px_0_0_#FF9900] disabled:cursor-not-allowed disabled:opacity-40',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
