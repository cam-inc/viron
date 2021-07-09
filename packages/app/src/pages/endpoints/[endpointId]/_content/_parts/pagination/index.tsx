import _ from 'lodash';
import React from 'react';
import PaginationComponent from '$components/pagination';
import { ON } from '$constants/index';
import { Pager, RequestValue } from '$types/oas';
import { UseBaseReturn } from '../../_hooks/useBase';

type Props = {
  pager: Pager;
  base: UseBaseReturn;
};
const Pagination: React.FC<Props> = ({ pager, base }) => {
  if (!base.data) {
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

  const handlePaginationRequestChange = function (num: number) {
    const requestValue = _.cloneDeep<RequestValue>(base.requestValue);
    requestValue.parameters = {
      ...requestValue.parameters,
      [pager.requestPageKey]: num,
    };
    base.fetch(requestValue);
  };

  return (
    <div>
      <PaginationComponent
        on={ON.SURFACE}
        current={current}
        max={max}
        onRequestChange={handlePaginationRequestChange}
      />
    </div>
  );
};
export default Pagination;
