import classnames from 'classnames';
import React, { useCallback, useState, useMemo } from 'react';
import { Props as BaseProps } from '~/components';
import Button, { Props as ButtonProps } from '~/components/button';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import ChevronUpIcon from '~/components/icon/chevronUp/outline';
import ClipboardCopyIcon from '~/components/icon/clipboardCopy/outline';
import CloseIcon from '~/components/icon/close/fill';
import Drawer, { useDrawer } from '~/portals/drawer';
import Popover, { usePopover } from '~/portals/popover';
import { useAppScreenGlobalStateValue } from '~/store';
import { COLOR_SYSTEM } from '~/types';
import { TableColumn, Sort, SORT } from '~/types/oas';
import Cell from './cell';

type Key = string;
type Value = any;
export type Data = Record<Key, Value>;

export type Props = BaseProps & {
  dataSource: Data[];
  columns: TableColumn[];
  renderActions?: (data: Data) => JSX.Element;
  onRowClick?: (data: Data) => void;
  onRequestSortChange?: (key: TableColumn['key'], sort: Sort) => void;
};
const Table: React.FC<Props> = ({
  on,
  className = '',
  dataSource,
  columns,
  renderActions,
  onRowClick,
  onRequestSortChange,
}) => {
  const drawer = useDrawer();
  const [selectedRowData, setSelectedRowData] = useState<Data>();
  const handleRowClick = useCallback<NonNullable<TrProps['onClick']>>(
    (data) => {
      onRowClick?.(data);
      setSelectedRowData(data);
      drawer.open();
    },
    [onRowClick, drawer]
  );

  return (
    <div className={className}>
      <div className="overflow-x-auto overscroll-x-contain">
        <table className="min-w-full border-collapse">
          <thead className={`border-b border-thm-on-${on}-slight`}>
            <Tr on={on} isHead>
              {columns.map((column) => {
                return (
                  <React.Fragment key={column.key}>
                    <Th on={on}>
                      {column.isSortable ? (
                        <button
                          onClick={() => {
                            let sort: Sort;
                            switch (column.sort) {
                              case SORT.ASC:
                                sort = SORT.DESC;
                                break;
                              case SORT.DESC:
                                sort = SORT.NONE;
                                break;
                              case SORT.NONE:
                                sort = SORT.ASC;
                                break;
                            }
                            onRequestSortChange?.(column.key, sort);
                          }}
                        >
                          <ThTitle on={on} column={column} />
                        </button>
                      ) : (
                        <ThTitle on={on} column={column} />
                      )}
                    </Th>
                  </React.Fragment>
                );
              })}
              {renderActions && <Th on={on} isSticky />}
            </Tr>
          </thead>
          <tbody className={`divide-y divide-thm-on-${on}-slight`}>
            {dataSource.map((data, idx) => (
              <React.Fragment key={idx}>
                <Tr on={on} data={data} onClick={handleRowClick}>
                  {columns.map((column) => (
                    <React.Fragment key={column.key}>
                      <Td on={on}>
                        <Cell
                          on={on}
                          schema={column.schema}
                          value={data[column.key]}
                        />
                      </Td>
                    </React.Fragment>
                  ))}
                  {renderActions && (
                    <Td on={on} isSticky>
                      {renderActions(data)}
                    </Td>
                  )}
                </Tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
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
    </div>
  );
};
export default Table;

type TrProps = BaseProps & {
  data?: Data;
  onClick?: (data: Data) => void;
  isHead?: boolean;
};
const Tr: React.FC<TrProps> = ({
  on,
  data,
  onClick,
  isHead = false,
  children,
}) => {
  const handleClick = useCallback(() => {
    onClick?.(data as Data);
  }, [data, onClick]);
  return (
    <tr
      className={classnames({
        [`hover:bg-thm-on-${on}-faint rounded-lg`]: !isHead,
        [`bg-thm-on-${on}-faint`]: isHead,
        'cursor-pointer': !!onClick,
      })}
      onClick={handleClick}
    >
      {children}
    </tr>
  );
};

type ThProps = BaseProps & {
  isSticky?: boolean;
};
const Th: React.FC<ThProps> = ({ on, isSticky = false, children }) => {
  const style: React.CSSProperties = {};
  if (isSticky) {
    style.background = `linear-gradient(to right, rgba(0,0,0,0) 0, var(--thm-${on}) 8px, var(--thm-${on}) 100%)`;
  }
  return (
    <th
      className={classnames(`text-xs text-left text-thm-on-${on}-low`, {
        'p-2 first:pl-4': !isSticky,
        'pr-2 py-2 pl-4 sticky right-0': isSticky,
      })}
      style={style}
    >
      {children}
    </th>
  );
};

type ThTitleProp = BaseProps & {
  column: TableColumn;
};
const ThTitle: React.FC<ThTitleProp> = ({ on, column }) => {
  const popover = usePopover<HTMLDivElement>();

  const screen = useAppScreenGlobalStateValue();
  const { lg } = screen;
  const handleMouseEnter = useCallback(() => {
    if (column.schema.description) {
      popover.open();
    }
  }, [popover, column]);
  const handleMouseLeave = useCallback(() => {
    popover.close();
  }, [popover]);

  return (
    <>
      <div className="flex items-center">
        <div className="font-bold mr-1.5">
          <span
            ref={popover.targetRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {column.name}
          </span>
        </div>
        {column.isSortable && (
          <div>
            <ChevronUpIcon
              className={classnames('w-em', {
                [`text-thm-on-${on}`]: column.sort === SORT.ASC,
                [`text-thm-on-${on}-slight`]: column.sort !== SORT.ASC,
              })}
            />
            <ChevronDownIcon
              className={classnames('w-em', {
                [`text-thm-on-${on}`]: column.sort === SORT.DESC,
                [`text-thm-on-${on}-slight`]: column.sort !== SORT.DESC,
              })}
            />
          </div>
        )}
      </div>
      {/*
      BUG: If it is smaller than lg, the popover will repeatedly show and hide.
      This is because as soon as Popover is displayed, it is judged to be onMouseLeave.
      */}
      {lg && (
        <Popover {...popover.bind}>
          <div className="w-max text-thm-on-surface">
            {column.schema.description}
          </div>
        </Popover>
      )}
    </>
  );
};

const Td: React.FC<BaseProps & { isSticky?: boolean }> = ({
  on,
  isSticky = false,
  children,
}) => {
  const style: React.CSSProperties = {};
  if (isSticky) {
    style.background = `linear-gradient(to right, rgba(0,0,0,0) 0, var(--thm-${on}) 8px, var(--thm-${on}) 100%)`;
  }
  return (
    <td
      className={classnames('p-2 first:pl-4', {
        'p-2 py-4': !isSticky,
        'pr-2 py-2 pl-4 sticky right-0': isSticky,
      })}
      style={style}
    >
      {children}
    </td>
  );
};

const RowObject: React.FC<
  BaseProps & {
    rowObject: Data;
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
            schema={columns.find((column) => column.key === objectKey)?.schema}
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
    schema: TableColumn['schema'] | undefined;
    selectedRowData: Data;
    objectKey: string;
  }
> = ({ on, schema, selectedRowData, objectKey }) => {
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
          {schema?.description && (
            <span className="ml-2 text-thm-on-surface-low">
              {schema.description}
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
                  schema={schema?.properties?.[childObjectKey]}
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
