import React, { useCallback, useMemo } from 'react';
import Button, { Props as ButtonProps } from '~/components/button';
import DotsCircleHorizontalIcon from '~/components/icon/dotsCircleHorizontal/outline';
import Table, { Props as TableProps } from '~/components/table';
import Popover, { usePopover } from '~/portals/popover';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, Content, SORT, Sort } from '~/types/oas';
import {
  extractTableColumns,
  getTableRows,
  mergeTableSortRequestValue,
} from '~/utils/oas';
import { UseBaseReturn } from '../../hooks/useBase';
import { UseDescendantsReturn } from '../../hooks/useDescendants';
import Descendant, { Props as DescendantProps } from '../../parts/descendant';

type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Content;
  base: UseBaseReturn;
  descendants: UseDescendantsReturn;
  onDescendantOperationSuccess: DescendantProps['onOperationSuccess'];
  onDescendantOperationFail: DescendantProps['onOperationFail'];
  sortState: [
    Record<string, Sort>,
    React.Dispatch<React.SetStateAction<Record<string, Sort>>>
  ];
};

const ContentTable: React.FC<Props> = ({
  endpoint,
  document,
  content,
  base,
  descendants,
  onDescendantOperationSuccess,
  onDescendantOperationFail,
  sortState,
}) => {
  const [sorts, setSorts] = sortState;
  const columns = useMemo<TableProps['columns']>(() => {
    const extractTableColumnsResult = extractTableColumns(document, content);
    if (extractTableColumnsResult.isFailure()) {
      return [];
    }
    const tableColumns = extractTableColumnsResult.value;
    return tableColumns
      .map((column) => ({
        ...column,
        sort: sorts[column.key] || SORT.NONE,
      }))
      .filter((column) => {
        if (!base.filter.enabled) {
          return false;
        }
        return !base.filter.listOmitted.includes(column.key);
      });
  }, [document, content, base, sorts]);

  const dataSource = useMemo<TableProps['dataSource']>(
    () => getTableRows(document, content, base.data),
    [document, content, base]
  );

  const renderActions = useCallback<NonNullable<TableProps['renderActions']>>(
    (data) => {
      return (
        <Operations
          endpoint={endpoint}
          document={document}
          descendants={descendants}
          data={data}
          onOperationSuccess={onDescendantOperationSuccess}
          onOperationFail={onDescendantOperationFail}
        />
      );
    },
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
    <Table
      on={COLOR_SYSTEM.BACKGROUND}
      columns={columns}
      dataSource={dataSource}
      renderActions={descendants.length ? renderActions : undefined}
      onRequestSortChange={handleRequestSortChange}
    />
  );
};
export default ContentTable;

type OperationsProps = {
  endpoint: Endpoint;
  document: Document;
  descendants: UseDescendantsReturn;
  data: DescendantProps['data'];
  onOperationSuccess: DescendantProps['onOperationSuccess'];
  onOperationFail: DescendantProps['onOperationFail'];
};
const Operations: React.FC<OperationsProps> = ({
  endpoint,
  document,
  descendants,
  data,
  onOperationSuccess,
  onOperationFail,
}) => {
  const popover = usePopover<HTMLDivElement>();
  const handleButtonClick = useCallback<ButtonProps['onClick']>(() => {
    popover.open();
  }, [popover]);
  const handleDescendantClick = useCallback<
    NonNullable<DescendantProps['onClick']>
  >(() => {
    popover.hide();
  }, [popover]);

  return (
    <>
      <div ref={popover.targetRef}>
        <Button
          variant="text"
          on={COLOR_SYSTEM.SURFACE}
          Icon={DotsCircleHorizontalIcon}
          onClick={handleButtonClick}
        />
      </div>
      <Popover {...popover.bind}>
        <ul>
          {descendants.map((descendant, idx) => (
            <li key={idx}>
              <Descendant
                endpoint={endpoint}
                document={document}
                descendant={descendant}
                data={data}
                onOperationSuccess={onOperationSuccess}
                onOperationFail={onOperationFail}
                onClick={handleDescendantClick}
              />
            </li>
          ))}
        </ul>
      </Popover>
    </>
  );
};
