import React, { useCallback } from 'react';
import Pagination, { Props as PaginationProps } from '@/components/pagination';
import { Document } from '@/types/oas';
import { UseBaseReturn } from '../../hooks/useBase';

type Props = {
  document: Document;
  base: UseBaseReturn;
};
const _Pagination: React.FC<Props> = ({ base }) => {
  const handlePaginationRequestChange = useCallback<
    PaginationProps['onRequestChange']
  >(
    (page) => {
      if (!base.pagination.enabled) {
        return null;
      }
      base.pagination.change(page);
    },
    [base]
  );

  if (!base.pagination.enabled) {
    return null;
  }

  return (
    <div>
      <Pagination
        currentPage={base.pagination.currentPage}
        total={base.pagination.maxPage}
        onRequestChange={handlePaginationRequestChange}
      />
    </div>
  );
};
export default _Pagination;
