import React, { useMemo } from 'react';
import { ClassName } from '$types/index';
import { Document, Info } from '$types/oas';
import { UseBaseReturn } from '../../_hooks/useBase';
import Pagination from '../pagination/index';

type Props = {
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
  base: UseBaseReturn;
  className?: ClassName;
};
const Tail: React.FC<Props> = ({ document, content, base, className = '' }) => {
  const paginationElm = useMemo<JSX.Element | null>(
    function () {
      if (
        !base.data ||
        content.type !== 'table' ||
        !content.pagination ||
        !document.info['x-table']?.pager
      ) {
        return null;
      }
      return <Pagination document={document} base={base} />;
    },
    [document, base]
  );

  if (!paginationElm) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-center">{paginationElm}</div>
    </div>
  );
};
export default Tail;
