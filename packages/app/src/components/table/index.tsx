import classnames from 'classnames';
import React, { useCallback } from 'react';
import { ON, On } from '$constants/index';
import { ClassName } from '$types/index';
import { Schema } from '$types/oas';

type Key = string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Value = any;
type Data = Record<Key, Value>;
type Column = {
  type: Schema['type'] | 'actions';
  name: string;
  key: Key;
};

export type Props = {
  on: On;
  dataSource: Data[];
  columns: Column[];
  className?: ClassName;
  renderActions?: (data: Data) => JSX.Element;
  onRowClick: (data: Data) => void;
};
const Table: React.FC<Props> = ({
  on,
  dataSource,
  columns,
  className = '',
  renderActions,
  onRowClick,
}) => {
  const handleRowClick = useCallback<NonNullable<TrProps['onClick']>>(
    function (data) {
      onRowClick(data);
    },
    [onRowClick]
  );

  return (
    <div className={className}>
      <div className="overflow-x-auto overscroll-x-contain">
        <table className="border-collapse">
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
                  }}
                />
              )}
              {columns.map(function (column) {
                return (
                  <React.Fragment key={column.key}>
                    <Th on={on} column={column} />
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

const Th: React.FC<{ on: On; column: Column }> = ({ on, column }) => {
  return (
    <th
      className={classnames('text-xs text-left', {
        'text-on-surface-high': on === ON.SURFACE,
      })}
    >
      <div className="flex items-center">
        <div className="flex-1 min-w-0 font-bold">{column.name}</div>
        <div className="flex-none ml-2">x</div>
      </div>
    </th>
  );
};

const Td: React.FC<{ on: On }> = ({ on, children }) => {
  return <td className="p-2">{children}</td>;
};

const Cell: React.FC<{ on: On; column: Column; value: Value }> = ({
  on,
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
