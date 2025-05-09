import { Loader2Icon } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import Error, { useError } from '@/components/error';
import { BaseError } from '@/errors';
import { ClassName, Endpoint } from '@/types';
import { Document, Content, CONTENT_TYPE, TableColumn } from '@/types/oas';
import { UseBaseReturn } from '../../hooks/useBase';
import { UseDescendantsReturn } from '../../hooks/useDescendants';
import NumberContent from '../../types/number/index';
import TableContent from '../../types/table/index';

type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Content;
  base: UseBaseReturn;
  descendants: UseDescendantsReturn;
  className?: ClassName;
};
const Body: React.FC<Props> = ({
  endpoint,
  document,
  content,
  base,
  descendants,
  className = '',
}) => {
  const handleDescendantOperationSuccess = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: any) => {
      base.refresh();
    },
    [base]
  );

  const error = useError({
    withModal: true,
  });
  const setError = error.setError;

  const handleDescendantOperationFail = useCallback(
    (error: BaseError) => {
      setError(error);
    },
    [setError]
  );

  // HOTFIX: TableContent 内部でStateを持つと、sort の値を変更した際に
  // TableContent が unmount されて state を保持できないため、
  // ここで State を持つ
  const sortState = useState<Record<TableColumn['key'], TableColumn['sort']>>(
    {}
  );

  const elm = useMemo<JSX.Element>(() => {
    if (base.isPending) {
      return (
        <div className="p-10 flex items-center justify-center">
          <Loader2Icon className="size-4 animate-spin" />
        </div>
      );
    }
    if (base.error) {
      return <Error error={base.error} />;
    }
    switch (content.type) {
      case CONTENT_TYPE.NUMBER:
        return (
          <NumberContent document={document} content={content} base={base} />
        );
      case CONTENT_TYPE.TABLE:
        return (
          <TableContent
            endpoint={endpoint}
            document={document}
            content={content}
            base={base}
            descendants={descendants}
            onDescendantOperationSuccess={handleDescendantOperationSuccess}
            onDescendantOperationFail={handleDescendantOperationFail}
            sortState={sortState}
          />
        );
    }
  }, [
    base,
    content,
    document,
    endpoint,
    descendants,
    handleDescendantOperationSuccess,
    handleDescendantOperationFail,
    sortState,
  ]);

  return (
    <>
      <div className={className}>{elm}</div>
      <Error {...error.bind} withModal />
    </>
  );
};
export default Body;
