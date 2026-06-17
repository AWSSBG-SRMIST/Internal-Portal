'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 pt-2 flex-wrap">
      <Button variant="outline" size="icon" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft size={16} />
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <Button key={p} variant={p === page ? 'default' : 'outline'} size="icon" onClick={() => onPageChange(p)}>
          {p}
        </Button>
      ))}
      <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
