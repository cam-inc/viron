import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import Drawer, { useDrawer } from '$components/drawer';
import Table, { Props as TableProps } from '$components/table';
import { ON } from '$constants/index';
import { Document, Info } from '$types/oas';
import {
  getTableColumns,
  getTableRows,
  mergeTableSortRequestValue,
} from '$utils/oas';
import { UseBaseReturn } from '../../_hooks/useBase';
import { UseDescendantsReturn } from '../../_hooks/useDescendants';
import Descendant, { Props as DescendantProps } from '../../_parts/descendant';

type Props = {
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
  base: UseBaseReturn;
  descendants: UseDescendantsReturn;
  onDescendantOperationSuccess: DescendantProps['onOperationSuccess'];
  onDescendantOperationFail: DescendantProps['onOperationFail'];
};
const _ContentTable: React.FC<Props> = ({
  document,
  content,
  base,
  descendants,
  onDescendantOperationSuccess,
  onDescendantOperationFail,
}) => {
  const [sorts, setSorts] = useState<
    Record<
      TableProps['columns'][number]['key'],
      TableProps['columns'][number]['sort']
    >
  >({});

  const columns = useMemo<TableProps['columns']>(
    function () {
      return getTableColumns(document, content).map(function (column) {
        return {
          ...column,
          sort: sorts[column.key],
        };
      });
    },
    [document, content, sorts]
  );

  const dataSource = useMemo<TableProps['dataSource']>(
    function () {
      return getTableRows(document, content, base.data);
    },
    [document, content, base]
  );

  const renderActions = useCallback<NonNullable<TableProps['renderActions']>>(
    function (data) {
      return (
        <div className="flex items-center">
          {descendants.map(function (descendant, idx) {
            return (
              <div key={idx}>
                <Descendant
                  descendant={descendant}
                  data={data}
                  onOperationSuccess={onDescendantOperationSuccess}
                  onOperationFail={onDescendantOperationFail}
                />
              </div>
            );
          })}
        </div>
      );
    },
    [descendants, onDescendantOperationSuccess, onDescendantOperationFail]
  );

  const handleRequestSortChange = useCallback<
    NonNullable<TableProps['onRequestSortChange']>
  >(
    function (key, sort) {
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

  const drawer = useDrawer();
  const handleTableRowClick = useCallback<TableProps['onRowClick']>(
    function () {
      drawer.open();
    },
    [drawer]
  );

  return (
    <>
      <Table
        on={ON.SURFACE}
        columns={columns}
        dataSource={dataSource}
        renderActions={descendants.length ? renderActions : undefined}
        onRequestSortChange={handleRequestSortChange}
        onRowClick={handleTableRowClick}
      />
      <Drawer {...drawer.bind}>TODO</Drawer>
    </>
  );
};
export default _ContentTable;
