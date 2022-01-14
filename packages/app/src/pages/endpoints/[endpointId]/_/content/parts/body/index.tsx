import React, { useCallback, useMemo } from 'react';
import Error from '~/components/error';
import Spinner from '~/components/spinner';
import { ClassName, COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, Info, TableColumn } from '~/types/oas';
import { UseBaseReturn } from '../../hooks/useBase';
import { UseDescendantsReturn } from '../../hooks/useDescendants';
import NumberContent from '../../types/number/index';
import TableContent from '../../types/table/index';

type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
  base: UseBaseReturn;
  descendants: UseDescendantsReturn;
  omittedColumns: TableColumn['key'][];
  className?: ClassName;
};
const Body: React.FC<Props> = ({
  endpoint,
  document,
  content,
  base,
  descendants,
  omittedColumns,
  className = '',
}) => {
  const handleDescendantOperationSuccess = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: any) => {
      console.log(data);
      base.refresh();
    },
    [base]
  );

  const handleDescendantOperationFail = useCallback((error: Error) => {
    // TODO: error handling
    console.log(error);
  }, []);

  const elm = useMemo<JSX.Element>(() => {
    if (base.isPending) {
      return <Spinner className="w-4" on={COLOR_SYSTEM.SURFACE} />;
    }
    if (base.error) {
      return <Error on={COLOR_SYSTEM.SURFACE} error={base.error} />;
    }
    switch (content.type) {
      case 'number':
        return (
          <NumberContent document={document} content={content} base={base} />
        );
      case 'table':
        return (
          <TableContent
            endpoint={endpoint}
            document={document}
            content={content}
            base={base}
            descendants={descendants}
            onDescendantOperationSuccess={handleDescendantOperationSuccess}
            onDescendantOperationFail={handleDescendantOperationFail}
            omittedColumns={omittedColumns}
          />
        );
      default:
        return <div>TODO: 未対応のtype</div>;
    }
  }, [
    document,
    content,
    base,
    descendants,
    handleDescendantOperationSuccess,
    handleDescendantOperationFail,
  ]);

  return <div className={className}>{elm}</div>;
};
export default Body;