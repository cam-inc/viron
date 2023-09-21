import React, { useCallback, useMemo, useState } from 'react';
import { Props as BaseProps } from '~/components';
import Button, { Props as ButtonProps } from '~/components/button';
import DotsCircleHorizontalIcon from '~/components/icon/dotsCircleHorizontal/outline';
import Table, { Props as TableProps } from '~/components/table';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import ClipboardCopyIcon from '~/components/icon/clipboardCopy/outline';
import Popover, { usePopover } from '~/portals/popover';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import {
  Document,
  Content,
  SORT,
  Sort,
  TableColumn,
  Schema,
} from '~/types/oas';
import {
  extractTableColumns,
  getTableRows,
  mergeTableSortRequestValue,
} from '~/utils/oas';
import { UseBaseReturn } from '../../hooks/useBase';
import { UseDescendantsReturn } from '../../hooks/useDescendants';
import Descendant, { Props as DescendantProps } from '../../parts/descendant';
import { XIcon } from '@heroicons/react/outline';
import { Data } from '~/components/table';
import Drawer, { useDrawer } from '~/portals/drawer';

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
  const drawer = useDrawer();
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

  const [rowObject, setRowObject] = useState<Data>();
  const onRowClick = useCallback(
    (data: Data) => {
      drawer.open();
      setRowObject(data);
    },
    [drawer]
  );
  const closeDrawer = () => {
    drawer.close();
  };

  return (
    <>
      <Table
        on={COLOR_SYSTEM.BACKGROUND}
        columns={columns}
        dataSource={dataSource}
        renderActions={descendants.length ? renderActions : undefined}
        onRequestSortChange={handleRequestSortChange}
        onRowClick={onRowClick}
      />
      {rowObject && (
        <Drawer {...drawer.bind}>
          <RowObject
            on={COLOR_SYSTEM.BACKGROUND}
            rowObject={rowObject}
            columns={columns}
            close={closeDrawer}
          />
        </Drawer>
      )}
    </>
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

const RowObject: React.FC<
  BaseProps & { rowObject: Data; columns: TableColumn[]; close: () => void }
> = ({ on, rowObject, columns, close }) => {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-10 pt-10">
        <div className="text-right">
          <Button
            variant="text"
            on={COLOR_SYSTEM.SURFACE}
            Icon={XIcon}
            onClick={close}
          />
        </div>
      </div>
      <div className="px-10 pb-10 grow overflow-scroll">
        <div>
          {Object.keys(rowObject).map((objectKey, index) => (
            <div className="mt-10">
              <Container
                on={on}
                columns={columns}
                rowObject={rowObject}
                objectKey={objectKey}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Container: React.FC<
  BaseProps & {
    columns: TableColumn[];
    rowObject: Data;
    index: number;
    objectKey: string;
  }
> = ({ on, columns, rowObject, index, objectKey }) => {
  const schema = (data: TableColumn[] | Data, objectKey: string) => {
    if (Array.isArray(data)) {
      const schema = data.find((column) => column.key === objectKey)?.schema;
      return schema;
    } else {
      if (data.properties) {
        const key = Object.keys(data.properties).find(
          (key) => key === objectKey
        );
        if (!key) {
          return;
        }
        return data.properties[key];
      }
    }
  };
  const [isOpened, setIsOpened] = useState<boolean>(true);
  const handleArrowClick = useCallback<ButtonProps['onClick']>(() => {
    setIsOpened(!isOpened);
  }, [isOpened]);
  const arrowIcon = useMemo<JSX.Element>(
    () => (
      <Button
        variant="text"
        on={on}
        Icon={isOpened ? ChevronDownIcon : ChevronRightIcon}
        onClick={handleArrowClick}
      />
    ),
    [on, isOpened, handleArrowClick]
  );

  const handleCopyClick = useCallback<ButtonProps['onClick']>(() => {
    globalThis.navigator.clipboard.writeText(rowObject[objectKey]);
  }, [rowObject[objectKey]]);

  const displayValue = (data: any) => {
    switch (typeof data) {
      case 'string' || 'number':
        return data;
      case 'boolean':
        if (data === true) {
          const value = 'TRUE';
          return value;
        } else {
          const value = 'FALSE';
          return value;
        }
      default:
        return data;
    }
  };

  return (
    <div key={index}>
      <div className="flex-none inline-flex items-center gap-1 whitespace-nowrap">
        {arrowIcon}
        <div className="text-sm">
          <span className="font-bold">{objectKey}</span>
          {schema(columns, objectKey)?.description && (
            <span className="ml-2 text-thm-on-surface-low">
              {schema(columns, objectKey)?.description}
            </span>
          )}
        </div>
      </div>
      {isOpened && (
        <div className="ml-5 pl-4 border-l border-thm-on-surface-slight">
          {typeof rowObject[objectKey] === 'object' ? (
            Object.keys(rowObject[objectKey]).map((childObjectKey, index) => (
              <Container
                on={on}
                columns={schema(columns, objectKey)}
                rowObject={rowObject[objectKey]}
                objectKey={childObjectKey}
                index={index}
              />
            ))
          ) : (
            <div className="bg-thm-on-background-slight rounded-lg px-2.5 p-3 inline-flex items-center whitespace-nowrap mr-5">
              <span className="mr-2 text-xs">
                {displayValue(rowObject[objectKey])}
              </span>
              <Button
                size="sm"
                variant="text"
                on={on}
                Icon={ClipboardCopyIcon}
                onClick={handleCopyClick}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
