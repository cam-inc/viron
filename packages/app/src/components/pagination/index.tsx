import React, { useCallback, useMemo } from 'react';
import {
  Pagination as UiPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationButton,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export type PaginationItem =
  | {
      type: 'page';
      page: number;
      isActive?: boolean;
    }
  | {
      type: 'previous' | 'next';
      page: number;
      disabled: boolean;
    }
  | {
      type: 'ellipsis';
    };
export const usePagination = ({
  total,
  currentPage,
  siblingCount = 1,
  boundaryCount = 1,
}: {
  total: number;
  currentPage: number;
  siblingCount?: number;
  boundaryCount?: number;
}) => {
  const lastPage = Math.max(1, total);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < lastPage;

  // Generate pagination items array
  const items = useMemo<PaginationItem[]>(() => {
    const result: PaginationItem[] = [];

    // Add previous button
    result.push({
      type: 'previous',
      page: currentPage - 1,
      disabled: !hasPrev,
    });

    // Calculate page numbers to display
    const pageItems: PaginationItem[] = [];

    // If there are few pages, show all without ellipsis
    if (lastPage <= boundaryCount * 2 + siblingCount * 2 + 3) {
      for (let i = 1; i <= lastPage; i++) {
        pageItems.push({
          type: 'page',
          page: i,
          isActive: i === currentPage,
        });
      }
    } else {
      // Pages at the beginning
      for (let i = 1; i <= boundaryCount; i++) {
        pageItems.push({
          type: 'page',
          page: i,
          isActive: i === currentPage,
        });
      }

      // Pages around the current page
      const leftSiblingIndex = Math.max(
        currentPage - siblingCount,
        boundaryCount + 1
      );
      const rightSiblingIndex = Math.min(
        currentPage + siblingCount,
        lastPage - boundaryCount
      );

      // Left ellipsis
      if (leftSiblingIndex > boundaryCount + 1) {
        pageItems.push({
          type: 'ellipsis',
        });
      } else if (boundaryCount + 1 < leftSiblingIndex) {
        pageItems.push({
          type: 'page',
          page: boundaryCount + 1,
          isActive: boundaryCount + 1 === currentPage,
        });
      }

      // Pages around current page
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pageItems.push({
          type: 'page',
          page: i,
          isActive: i === currentPage,
        });
      }

      // Right ellipsis
      if (rightSiblingIndex < lastPage - boundaryCount) {
        pageItems.push({
          type: 'ellipsis',
        });
      } else if (rightSiblingIndex + 1 < lastPage - boundaryCount + 1) {
        pageItems.push({
          type: 'page',
          page: rightSiblingIndex + 1,
          isActive: rightSiblingIndex + 1 === currentPage,
        });
      }

      // Pages at the end
      for (let i = lastPage - boundaryCount + 1; i <= lastPage; i++) {
        pageItems.push({
          type: 'page',
          page: i,
          isActive: i === currentPage,
        });
      }
    }

    // Add page numbers to result
    result.push(...pageItems);

    // Add next button
    result.push({
      type: 'next',
      page: currentPage + 1,
      disabled: !hasNext,
    });

    return result;
  }, [currentPage, lastPage, siblingCount, boundaryCount, hasPrev, hasNext]);

  return { items };
};

export type Props = {
  className?: string;
  currentPage: number;
  total: number;
  onRequestChange: (num: number) => void;
};
const Pagination: React.FC<Props> = ({
  className = '',
  currentPage,
  total,
  onRequestChange,
}) => {
  const { items } = usePagination({
    total,
    currentPage,
  });

  const handlePageClick = useCallback(
    (page: number) => {
      onRequestChange(page);
    },
    [onRequestChange]
  );

  return (
    <UiPagination className={className}>
      <PaginationContent>
        {items.map((item, index) => (
          <PaginationItem key={item.type + index} className="flex-none">
            {(() => {
              if (item.type === 'page') {
                return (
                  <PaginationButton
                    isActive={item.isActive}
                    onClick={() => handlePageClick(item.page)}
                  >
                    {item.page}
                  </PaginationButton>
                );
              }
              if (item.type === 'ellipsis') {
                return <PaginationEllipsis />;
              }
              if (item.type === 'previous') {
                return (
                  <PaginationPrevious
                    onClick={() => handlePageClick(item.page)}
                    disabled={item.disabled}
                  />
                );
              }
              return (
                <PaginationNext
                  onClick={() => handlePageClick(item.page)}
                  disabled={item.disabled}
                />
              );
            })()}
          </PaginationItem>
        ))}
      </PaginationContent>
    </UiPagination>
  );
};
export default Pagination;
