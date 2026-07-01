import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold font-mono transition-all duration-150 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF9900] disabled:pointer-events-none disabled:opacity-40 border-2',
  {
    variants: {
      variant: {
        default:     'bg-[#FF9900] text-black border-[#FF9900] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_0_rgba(255,153,0,0.35)]',
        destructive: 'bg-[#ff3333] text-white border-[#ff3333] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_0_rgba(255,51,51,0.35)]',
        outline:     'border-[#3d3d3d] bg-transparent text-[#e0e0e0] hover:border-[#888] hover:bg-[#1a1a1a]',
        secondary:   'bg-[#1a1a1a] text-[#e0e0e0] border-[#2d2d2d] hover:border-[#555] hover:bg-[#222]',
        ghost:       'border-transparent bg-transparent text-[#999] hover:bg-[#1a1a1a] hover:text-white hover:border-[#2d2d2d]',
        link:        'text-[#FF9900] border-transparent underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm:      'h-11 sm:h-8 px-3 text-xs',
        lg:      'h-11 px-8',
        icon:    'h-11 w-11 sm:h-9 sm:w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
