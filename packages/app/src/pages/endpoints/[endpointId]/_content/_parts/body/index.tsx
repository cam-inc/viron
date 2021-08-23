import React, { useCallback, useMemo } from 'react';
import Error from '$components/error';
import Spinner from '$components/spinner';
import { ON } from '$constants/index';
import { ClassName, Endpoint } from '$types/index';
import { Document, Info, TableColumn } from '$types/oas';
import { UseBaseReturn } from '../../_hooks/useBase';
import { UseDescendantsReturn } from '../../_hooks/useDescendants';
import NumberContent from '../../_types/_number/index';
import TableContent from '../../_types/_table/index';

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
    function (data: any) {
      console.log(data);
      base.refresh();
    },
    [base]
  );

  const handleDescendantOperationFail = useCallback(function (error: Error) {
    // TODO: error handling
    console.log(error);
  }, []);

  const elm = useMemo<JSX.Element>(
    function () {
      if (base.isPending) {
        return <Spinner className="w-4" on={ON.SURFACE} />;
      }
      if (base.error) {
        return <Error on={ON.SURFACE} error={base.error} />;
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
    },
    [
      document,
      content,
      base,
      descendants,
      handleDescendantOperationSuccess,
      handleDescendantOperationFail,
    ]
  );

  return <div className={className}>{elm}</div>;
};
export default Body;
