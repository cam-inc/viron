import React, { useCallback, useMemo, useState } from 'react';
import { Props as BaseProps } from '~/components';
import Button, { Props as ButtonProps } from '~/components/button';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import ClipboardCopyIcon from '~/components/icon/clipboardCopy/outline';
import CloseIcon from '~/components/icon/close/fill';
import DotsCircleHorizontalIcon from '~/components/icon/dotsCircleHorizontal/outline';
import Table, { Props as TableProps } from '~/components/table';
import Drawer, { useDrawer } from '~/portals/drawer';
import Popover, { usePopover } from '~/portals/popover';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, Content, SORT, Sort, TableColumn } from '~/types/oas';
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

type Value = any;
type Key = string;
type ObjectData = Record<Key, Value>;

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

  const [selectedRowData, setSelectedRowData] = useState<ObjectData>();
  const handleRowClick = useCallback(
    (data: ObjectData) => {
      drawer.open();
      setSelectedRowData(data);
    },
    [drawer]
  );

  return (
    <>
      <Table
        on={COLOR_SYSTEM.BACKGROUND}
        columns={columns}
        dataSource={dataSource}
        renderActions={descendants.length ? renderActions : undefined}
        onRequestSortChange={handleRequestSortChange}
        onRowClick={handleRowClick}
      />
      {selectedRowData && (
        <Drawer {...drawer.bind}>
          <RowObject
            on={COLOR_SYSTEM.BACKGROUND}
            rowObject={selectedRowData}
            columns={columns}
            close={drawer.close}
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
  BaseProps & {
    rowObject: ObjectData;
    columns: TableColumn[];
    close: () => void;
  }
> = ({ on, rowObject, columns, close }) => {
  return (
    <div className="px-10 py-10 flex flex-col h-full w-full">
      <div>
        <Button
          className="flex mr-0 ml-auto"
          variant="text"
          on={COLOR_SYSTEM.SURFACE}
          Icon={CloseIcon}
          onClick={close}
        />
      </div>
      <div className="grow overflow-scroll space-y-10">
        {Object.keys(rowObject).map((objectKey, index) => (
          <Accordion
            key={index}
            on={on}
            columns={columns}
            selectedRowData={rowObject}
            objectKey={objectKey}
          />
        ))}
      </div>
    </div>
  );
};

const Accordion: React.FC<
  BaseProps & {
    columns: TableColumn[];
    selectedRowData: ObjectData;
    objectKey: string;
  }
> = ({ on, columns, selectedRowData, objectKey }) => {
  const schema = (data: TableColumn[] | ObjectData, objectKey: string) => {
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
    globalThis.navigator.clipboard.writeText(selectedRowData[objectKey]);
  }, [selectedRowData, objectKey]);

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
    <div>
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
          {typeof selectedRowData[objectKey] === 'object' ? (
            Object.keys(selectedRowData[objectKey]).map(
              (childObjectKey, index) => (
                <Accordion
                  key={index}
                  on={on}
                  columns={schema(columns, objectKey)}
                  selectedRowData={selectedRowData[objectKey]}
                  objectKey={childObjectKey}
                />
              )
            )
          ) : (
            <div className="bg-thm-on-background-slight rounded-lg px-2.5 p-3 inline-flex items-center whitespace-nowrap mr-5">
              <span className="mr-2 text-xs">
                {displayValue(selectedRowData[objectKey])}
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
