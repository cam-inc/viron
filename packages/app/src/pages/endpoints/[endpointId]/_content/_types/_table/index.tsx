import { BiSpreadsheet } from '@react-icons/all-files/bi/BiSpreadsheet';
import React, { useCallback, useMemo, useState } from 'react';
import Button from '$components/button';
import Popover, { usePopover } from '$components/popover';
import Table, {
  Props as TableProps,
  Data as TableData,
} from '$components/table';
import { ON } from '$constants/index';
import { Endpoint } from '$types/index';
import { Document, Info, TableColumn, TABLE_SORT } from '$types/oas';
import {
  getTableColumns,
  getTableRows,
  mergeTableSortRequestValue,
} from '$utils/oas';
import { UseBaseReturn } from '../../_hooks/useBase';
import { UseDescendantsReturn } from '../../_hooks/useDescendants';
import Descendant, { Props as DescendantProps } from '../../_parts/descendant';

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
const _ContentTable: React.FC<Props> = ({
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
    function () {
      return getTableColumns(document, content)
        .map(function (column) {
          return {
            ...column,
            sort: sorts[column.key] || TABLE_SORT.NONE,
          };
        })
        .filter(function (column) {
          return !omittedColumns.includes(column.key);
        });
    },
    [document, content, omittedColumns, sorts]
  );

  const dataSource = useMemo<TableProps['dataSource']>(
    function () {
      return getTableRows(document, content, base.data);
    },
    [document, content, base]
  );

  const Action = useMemo<React.FC<{ data: TableData }>>(
    function () {
      return ({ data }) => {
        return null;
        /*
      const popover = usePopover<HTMLDivElement>();
      const handleActionButtonClick = useCallback(function() {
        popover.open();
      }, [popover]);
      const handleDescendantClick = useCallback(function() {
        popover.hide();
      }, [popover]);
      return (
        <>
          <div className="flex items-center" ref={popover.targetRef}>
            <Button on={ON.SURFACE} Icon={BiSpreadsheet} onClick={handleActionButtonClick} />
          </div>
          <Popover {...popover.bind}>
            <div className="">
              {descendants.map(function(descendant, idx) {
                return (
                  <div key={idx}>
                    <Descendant
                      endpoint={endpoint}
                      document={document}
                      descendant={descendant}
                      data={data}
                      onOperationSuccess={onDescendantOperationSuccess}
                      onOperationFail={onDescendantOperationFail}
                      onClick={handleDescendantClick}
                    />
                  </div>
                );
              })}
            </div>
          </Popover>
        </>
      );
      */
      };
    },
    [
      endpoint,
      document,
      descendants,
      onDescendantOperationSuccess,
      onDescendantOperationFail,
    ]
  );

  const renderActions = useCallback<NonNullable<TableProps['renderActions']>>(
    function (data) {
      return <Action data={data} />;
    },
    [Action]
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

  return (
    <>
      <Table
        on={ON.SURFACE}
        columns={columns}
        dataSource={dataSource}
        renderActions={descendants.length ? renderActions : undefined}
        onRequestSortChange={handleRequestSortChange}
      />
    </>
  );
};
export default _ContentTable;
