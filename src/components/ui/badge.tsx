import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center px-2 py-0.5 text-xs font-mono font-bold tracking-wide border',
  {
    variants: {
      variant: {
        default:     'bg-orange-500/20 text-orange-300 border-orange-500/40',
        secondary:   'bg-[#1a1a1a] text-[#aaa] border-[#333]',
        destructive: 'bg-red-500/20 text-red-300 border-red-500/40',
        success:     'bg-green-500/20 text-green-300 border-green-500/40',
        warning:     'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
        outline:     'border-[#444] text-[#888] bg-transparent',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
