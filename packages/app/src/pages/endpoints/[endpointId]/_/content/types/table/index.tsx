import React, { useCallback, useMemo, useState } from 'react';
import Table, { Props as TableProps } from '~/components/table';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, Info, TableColumn, TABLE_SORT } from '~/types/oas';
import {
  getTableColumns,
  getTableRows,
  mergeTableSortRequestValue,
} from '~/utils/oas';
import { UseBaseReturn } from '../../hooks/useBase';
import { UseDescendantsReturn } from '../../hooks/useDescendants';
import Descendant, { Props as DescendantProps } from '../../parts/descendant';

type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
  base: UseBaseReturn;
  descendants: UseDescendantsReturn;
  onDescendantOperationSuccess: DescendantProps['onOperationSuccess'];
  onDescendantOperationFail: DescendantProps['onOperationFail'];
  omittedColumns: TableColumn['key'][];
};
const ContentTable: React.FC<Props> = ({
  endpoint,
  document,
  content,
  base,
  descendants,
  onDescendantOperationSuccess,
  onDescendantOperationFail,
  omittedColumns,
}) => {
  const [sorts, setSorts] = useState<
    Record<
      TableProps['columns'][number]['key'],
      TableProps['columns'][number]['sort']
    >
  >({});

  const columns = useMemo<TableProps['columns']>(
    () =>
      getTableColumns(document, content)
        .map(function (column) {
          return {
            ...column,
            sort: sorts[column.key] || TABLE_SORT.NONE,
          };
        })
        .filter(function (column) {
          return !omittedColumns.includes(column.key);
        }),
    [document, content, omittedColumns, sorts]
  );

  const dataSource = useMemo<TableProps['dataSource']>(
    () => getTableRows(document, content, base.data),
    [document, content, base]
  );

  const renderActions = useCallback<NonNullable<TableProps['renderActions']>>(
    (data) => (
      <div className="flex items-center">
        {descendants.map((descendant, idx) => (
          <div key={idx}>
            <Descendant
              endpoint={endpoint}
              document={document}
              descendant={descendant}
              data={data}
              onOperationSuccess={onDescendantOperationSuccess}
              onOperationFail={onDescendantOperationFail}
            />
          </div>
        ))}
      </div>
    ),
    [
      endpoint,
      document,
      descendants,
      onDescendantOperationSuccess,
      onDescendantOperationFail,
    ]
  );

  const handleRequestSortChange = useCallback<
    NonNullable<TableProps['onRequestSortChange']>
  >(
    (key, sort) => {
      const newSorts = {
        ...sorts,
        [key]: sort,
      };
      setSorts(newSorts);
      const requestValue = mergeTableSortRequestValue(
        document,
        base.request,
        base.requestValue,
        newSorts
      );
      base.fetch(requestValue);
    },
    [document, base, sorts]
  );

  return (
    <>
      <Table
        on={COLOR_SYSTEM.SURFACE}
        columns={columns}
        dataSource={dataSource}
        renderActions={descendants.length ? renderActions : undefined}
        onRequestSortChange={handleRequestSortChange}
      />
    </>
  );
};
export default ContentTable;