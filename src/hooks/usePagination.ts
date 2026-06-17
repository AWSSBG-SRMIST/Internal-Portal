import { useMemo, useState } from 'react';

export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1);
  const [prevItems, setPrevItems] = useState(items);

  // `items` is a fresh array reference whenever the filtered set changes
  // (search/role/domain filters) — adjusting state during render (React's
  // recommended pattern for this) jumps back to page 1 instead of landing
  // on a now out-of-range or confusingly-different page.
  if (items !== prevItems) {
    setPrevItems(items);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const paginatedItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  );

  return { page, setPage, totalPages, paginatedItems };
}
