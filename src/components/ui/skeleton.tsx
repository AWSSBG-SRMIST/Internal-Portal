import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-[#111] border border-[#1e1e1e] loading-scan', className)}
      {...props}
    />
  );
}

export { Skeleton };
