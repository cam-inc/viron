import _ from 'lodash';
import React, { useCallback } from 'react';
import Pagination, { Props as PaginationProps } from '~/components/pagination';
import { COLOR_SYSTEM } from '~/types';
import { Document } from '~/types/oas';
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
        on={COLOR_SYSTEM.SURFACE}
        current={base.pagination.currentPage}
        max={base.pagination.maxPage}
        onRequestChange={handlePaginationRequestChange}
      />
    </div>
  );
};
export default _Pagination;
