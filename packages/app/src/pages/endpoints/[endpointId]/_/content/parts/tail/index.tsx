import React from 'react';
import { ClassName } from '~/types';
import { Document, Content } from '~/types/oas';
import { UseBaseReturn } from '../../hooks/useBase';
import Pagination from '../pagination/index';

type Props = {
  document: Document;
  content: Content;
  base: UseBaseReturn;
  className?: ClassName;
};
const Tail: React.FC<Props> = ({ document, base, className = '' }) => {
  if (!base.pagination.enabled) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-center">
        <Pagination document={document} base={base} />
      </div>
    </div>
  );
};
export default Tail;
