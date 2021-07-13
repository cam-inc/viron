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
type Data = Record<Key, Value>;
type Column = Omit<TableColumn, 'type'> & {
  type: TableColumn['type'] | 'actions';
  sort: TableSort;
};

export type Props = {
  on: On;
  dataSource: Data[];
  columns: Column[];
  className?: ClassName;
  renderActions?: (data: Data) => JSX.Element;
  onRowClick: (data: Data) => void;
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
      onRowClick(data);
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
            <Tr on={on}>
              {renderActions && (
                <Th
                  on={on}
                  column={{
                    type: 'actions',
                    name: 'actions',
                    // TODO: 重複しないように。
                    key: 'actions',
                    isSortable: false,
                    sort: TABLE_SORT.NONE,
                  }}
                />
              )}
              {columns.map(function (column) {
                return (
                  <React.Fragment key={column.key}>
                    <Th
                      on={on}
                      column={column}
                      onClick={handleColumnHeadClick}
                    />
                  </React.Fragment>
                );
              })}
            </Tr>
          </thead>
          <tbody>
            {dataSource.map(function (data, idx) {
              return (
                <React.Fragment key={idx}>
                  <Tr on={on} data={data} onClick={handleRowClick}>
                    {renderActions && <Td on={on}>{renderActions(data)}</Td>}
                    {columns.map(function (column) {
                      return (
                        <React.Fragment key={column.key}>
                          <Td on={on}>
                            <Cell
                              on={on}
                              column={column}
                              value={data[column.key]}
                            />
                          </Td>
                        </React.Fragment>
                      );
                    })}
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
};
const Tr: React.FC<TrProps> = ({ on, data, onClick, children }) => {
  const handleClick = useCallback(
    function () {
      onClick?.(data as Data);
    },
    [data, onClick]
  );
  return (
    <tr
      className={classnames('border-b', {
        'border-on-surface-faint': on === ON.SURFACE,
      })}
      onClick={handleClick}
    >
      {children}
    </tr>
  );
};

type ThProps = {
  on: On;
  column: Column;
  onClick?: (column: Column) => void;
};
const Th: React.FC<ThProps> = ({ on, column, onClick }) => {
  const handleClick = useCallback(
    function () {
      onClick?.(column);
    },
    [column, onClick]
  );

  return (
    <th
      className={classnames('p-2 text-xs text-left', {
        'text-on-surface-high': on === ON.SURFACE,
      })}
      onClick={handleClick}
    >
      <div className="flex items-center">
        {column.isSortable && (
          <div className="flex-none mr-1">
            <div
              className={classnames({
                'text-on-background-faint':
                  on === ON.BACKGROUND && column.sort !== TABLE_SORT.ASC,
                'text-on-background':
                  on === ON.BACKGROUND && column.sort === TABLE_SORT.ASC,
                'text-on-surface-faint':
                  on === ON.SURFACE && column.sort !== TABLE_SORT.ASC,
                'text-on-surface':
                  on === ON.SURFACE && column.sort === TABLE_SORT.ASC,
              })}
            >
              <BiCaretUp />
            </div>
            <div
              className={classnames({
                'text-on-background-faint':
                  on === ON.BACKGROUND && column.sort !== TABLE_SORT.DESC,
                'text-on-background':
                  on === ON.BACKGROUND && column.sort === TABLE_SORT.DESC,
                'text-on-surface-faint':
                  on === ON.SURFACE && column.sort !== TABLE_SORT.DESC,
                'text-on-surface':
                  on === ON.SURFACE && column.sort === TABLE_SORT.DESC,
              })}
            >
              <BiCaretDown />
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0 font-bold">{column.name}</div>
      </div>
    </th>
  );
};

const Td: React.FC<{ on: On }> = ({ /*on,*/ children }) => {
  return <td className="p-2">{children}</td>;
};

const Cell: React.FC<{ on: On; column: Column; value: Value }> = ({
  /*on,*/
  column,
  value,
}) => {
  return (
    <div>
      <div className="text-xxs">[{column.type}]</div>
      <div>{value}</div>
    </div>
  );
};
