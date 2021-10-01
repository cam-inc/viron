import { BiCaretDown } from '@react-icons/all-files/bi/BiCaretDown';
import { BiCaretUp } from '@react-icons/all-files/bi/BiCaretUp';
import classnames from 'classnames';
import React, { useCallback } from 'react';
import { ON, On } from '$constants/index';
import { ClassName } from '$types/index';
import { TableColumn, TableSort, TABLE_SORT } from '$types/oas';

type Key = string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Value = any;
export type Data = Record<Key, Value>;
type Column = TableColumn & {
  sort: TableSort;
  // isActions?: boolean;
};

export type Props = {
  on: On;
  dataSource: Data[];
  columns: Column[];
  className?: ClassName;
  renderActions?: (data: Data) => JSX.Element;
  onRowClick?: (data: Data) => void;
  onRequestSortChange?: (key: Column['key'], sort: Column['sort']) => void;
};
const Table: React.FC<Props> = ({
  on,
  dataSource,
  columns,
  className = '',
  renderActions,
  onRowClick,
  onRequestSortChange,
}) => {
  const handleColumnHeadClick = useCallback<NonNullable<ThProps['onClick']>>(
    function (column) {
      if (!column.isSortable) {
        return;
      }
      let sort: Column['sort'];
      switch (column.sort) {
        case TABLE_SORT.ASC:
          sort = TABLE_SORT.DESC;
          break;
        case TABLE_SORT.DESC:
          sort = TABLE_SORT.NONE;
          break;
        case TABLE_SORT.NONE:
          sort = TABLE_SORT.ASC;
          break;
      }
      onRequestSortChange?.(column.key, sort);
    },
    [onRequestSortChange]
  );

  const handleRowClick = useCallback<NonNullable<TrProps['onClick']>>(
    function (data) {
      onRowClick?.(data);
    },
    [onRowClick]
  );

  return (
    <div className={className}>
      <div className="overflow-x-auto overscroll-x-contain">
        <table className="min-w-full border-collapse">
          <thead
            className={classnames('border-b-2', {
              'border-on-surface-faint': on === ON.SURFACE,
            })}
          >
            <Tr on={on} isHead>
              {columns.map(function (column) {
                return (
                  <React.Fragment key={column.key}>
                    <Th on={on} column={column} onClick={handleColumnHeadClick}>
                      <ThTitle on={on} column={column} />
                    </Th>
                  </React.Fragment>
                );
              })}
              {renderActions && (
                <Th on={on} isSticky>
                  <div>actions</div>
                </Th>
              )}
            </Tr>
          </thead>
          <tbody>
            {dataSource.map(function (data, idx) {
              return (
                <React.Fragment key={idx}>
                  <Tr on={on} data={data} onClick={handleRowClick}>
                    {columns.map(function (column) {
                      return (
                        <React.Fragment key={column.key}>
                          <Td on={on}>
                            <CellValueType on={on} column={column}>
                              <CellValue
                                on={on}
                                column={column}
                                value={data[column.key]}
                              />
                            </CellValueType>
                          </Td>
                        </React.Fragment>
                      );
                    })}
                    {renderActions && (
                      <Td on={on} isSticky>
                        {renderActions(data)}
                      </Td>
                    )}
                  </Tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Table;

type TrProps = {
  on: On;
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
  const handleClick = useCallback(
    function () {
      onClick?.(data as Data);
    },
    [data, onClick]
  );
  return (
    <tr
      className={classnames('border-b', {
        'border-on-background-faint': on === ON.BACKGROUND,
        'hover:bg-on-background-faint': on === ON.BACKGROUND && !isHead,
        'border-on-surface-faint': on === ON.SURFACE,
        'hover:bg-on-surface-faint': on === ON.SURFACE && !isHead,
        'border-on-primary-faint': on === ON.PRIMARY,
        'hover:bg-on-primary-faint': on === ON.PRIMARY && !isHead,
        'border-on-complementary-faint': on === ON.COMPLEMENTARY,
        'hover:bg-on-complementary-faint': on === ON.COMPLEMENTARY && !isHead,
      })}
      onClick={handleClick}
    >
      {children}
    </tr>
  );
};

type ThProps = {
  on: On;
  column?: Column;
  onClick?: (column: Column) => void;
  isSticky?: boolean;
};
const Th: React.FC<ThProps> = ({
  on,
  column,
  onClick,
  isSticky = false,
  children,
}) => {
  const handleClick = useCallback(
    function () {
      if (column) onClick?.(column);
    },
    [column, onClick]
  );
  const style: React.CSSProperties = {};
  if (isSticky) {
    style.background = `linear-gradient(to right, rgba(0,0,0,0) 0, var(--color-${on}) 8px, var(--color-${on}) 100%)`;
  }
  return (
    <th
      className={classnames('text-xs text-left', {
        'p-2': !isSticky,
        'pr-2 py-2 pl-4 sticky right-0': isSticky,
        'text-on-background-high': on === ON.BACKGROUND,
        'text-on-surface-high': on === ON.SURFACE,
        'text-on-primary-high': on === ON.PRIMARY,
        'text-on-complementary-high': on === ON.COMPLEMENTARY,
      })}
      style={style}
      onClick={handleClick}
    >
      {children}
    </th>
  );
};

const ThTitle: React.FC<{ on: On; column: Column }> = ({ on, column }) => {
  return (
    <div className="flex items-center">
      <div className="flex-none mr-1">
        <div
          className={classnames({
            'text-on-background-slight':
              on === ON.BACKGROUND && column.sort !== TABLE_SORT.ASC,
            'text-on-background':
              on === ON.BACKGROUND && column.sort === TABLE_SORT.ASC,
            'text-on-surface-slight':
              on === ON.SURFACE && column.sort !== TABLE_SORT.ASC,
            'text-on-surface':
              on === ON.SURFACE && column.sort === TABLE_SORT.ASC,
            'text-on-primary-slight':
              on === ON.PRIMARY && column.sort !== TABLE_SORT.ASC,
            'text-on-primary':
              on === ON.PRIMARY && column.sort === TABLE_SORT.ASC,
            'text-on-complementary-slight':
              on === ON.COMPLEMENTARY && column.sort !== TABLE_SORT.ASC,
            'text-on-complementary':
              on === ON.COMPLEMENTARY && column.sort === TABLE_SORT.ASC,
          })}
        >
          <BiCaretUp />
        </div>
        <div
          className={classnames({
            'text-on-background-slight':
              on === ON.BACKGROUND && column.sort !== TABLE_SORT.DESC,
            'text-on-background':
              on === ON.BACKGROUND && column.sort === TABLE_SORT.DESC,
            'text-on-surface-slight':
              on === ON.SURFACE && column.sort !== TABLE_SORT.DESC,
            'text-on-surface':
              on === ON.SURFACE && column.sort === TABLE_SORT.DESC,
            'text-on-primary-slight':
              on === ON.PRIMARY && column.sort !== TABLE_SORT.DESC,
            'text-on-primary':
              on === ON.PRIMARY && column.sort === TABLE_SORT.DESC,
            'text-on-complementary-slight':
              on === ON.COMPLEMENTARY && column.sort !== TABLE_SORT.DESC,
            'text-on-complementary':
              on === ON.COMPLEMENTARY && column.sort === TABLE_SORT.DESC,
          })}
        >
          <BiCaretDown />
        </div>
      </div>
      <div className="flex-1 min-w-0 font-bold">{column.name}</div>
    </div>
  );
};

const Td: React.FC<{ on: On; isSticky?: boolean }> = ({
  on,
  isSticky = false,
  children,
}) => {
  const style: React.CSSProperties = {};
  if (isSticky) {
    style.background = `linear-gradient(to right, rgba(0,0,0,0) 0, var(--color-${on}) 8px, var(--color-${on}) 100%)`;
  }
  return (
    <td
      className={classnames('p-2', {
        'p-2': !isSticky,
        'pr-2 py-2 pl-4 sticky right-0': isSticky,
      })}
      style={style}
    >
      {children}
    </td>
  );
};

const CellValueType: React.FC<{ on: On; column: Column }> = ({
  on,
  column,
  children,
}) => {
  return (
    <>
      <div className="whitespace-nowrap">
        <div
          className={classnames('text-xxs', {
            'text-on-background-slight': on === ON.BACKGROUND,
            'text-on-surface-slight': on === ON.SURFACE,
            'text-on-primary-slight': on === ON.PRIMARY,
            'text-on-complementary-slight': on === ON.COMPLEMENTARY,
          })}
        >
          [{column.schema.type}]
        </div>
        {children}
      </div>
    </>
  );
};

const CellValue: React.FC<{ on: On; column: Column; value: Value }> = ({
  on,
  value,
  column,
}) => {
  const formattedValue = function (value: Value, column: Column) {
    switch (column.schema.type) {
      case 'string':
        if (
          typeof value === 'string' &&
          column.schema.format === ('date' || 'date-time')
        ) {
          const date = new Date(value);
          const intlDate = new Intl.DateTimeFormat([], {
            dateStyle: 'medium',
            timeStyle: 'medium',
          }).format(date);
          return intlDate;
        }
        return JSON.stringify(value);
      case 'number' || 'integer':
        if (typeof value === 'number') return value.toLocaleString();
        break;
      default:
        return JSON.stringify(value);
    }
  };
  return (
    <>
      <div className="whitespace-nowrap">
        <div
          className={classnames('text-sm', {
            'text-on-background': on === ON.BACKGROUND,
            'text-on-surface': on === ON.SURFACE,
            'text-on-primary': on === ON.PRIMARY,
            'text-on-complementary': on === ON.COMPLEMENTARY,
          })}
        >
          {formattedValue(value, column)}
        </div>
      </div>
    </>
  );
};
