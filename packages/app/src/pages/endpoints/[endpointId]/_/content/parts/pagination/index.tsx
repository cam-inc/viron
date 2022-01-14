import _ from 'lodash';
import React, { useCallback } from 'react';
import PaginationComponent from '~/components/pagination';
import { COLOR_SYSTEM } from '~/types';
import { Document } from '~/types/oas';
import { mergeTablePagerRequestValue } from '~/utils/oas';
import { UseBaseReturn } from '../../hooks/useBase';

type Props = {
  document: Document;
  base: UseBaseReturn;
};
const Pagination: React.FC<Props> = ({ document, base }) => {
  if (!base.data) {
    throw new Error('TODO');
  }
  const pager = document.info['x-table']?.pager;
  if (!pager) {
    throw new Error('TODO');
  }
  if (typeof base.data[pager.responsePageKey] !== 'number') {
    throw new Error('TODO');
  }
  if (typeof base.data[pager.responseMaxpageKey] !== 'number') {
    throw new Error('TODO');
  }

  const current = base.data[pager.responsePageKey];
  const max = base.data[pager.responseMaxpageKey];

  const handlePaginationRequestChange = useCallback(
    (page: number) => {
      const requestValue = mergeTablePagerRequestValue(
        document,
        base.requestValue,
        page
      );
      base.fetch(requestValue);
    },
    [document, base]
  );

  return (
    <div>
      <PaginationComponent
        on={COLOR_SYSTEM.SURFACE}
        current={current}
        max={max}
        onRequestChange={handlePaginationRequestChange}
      />
    </div>
  );
};
export default Pagination;
