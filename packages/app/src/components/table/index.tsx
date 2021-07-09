import classnames from 'classnames';
import React from 'react';
import { ON, On } from '$constants/index';
import { ClassName } from '$types/index';

type Key = string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Value = any;
type Data = Record<Key, Value>;
type Column = {
  title: string;
  key: Key;
};

export type Props = {
  on: On;
  dataSource: Data[];
  columns: Column[];
  className?: ClassName;
};
const Table: React.FC<Props> = ({
  on,
  dataSource,
  columns,
  className = '',
}) => {
  return (
    <div className={className}>
      <div className="overflow-x-auto overscroll-x-contain">
        <table>
          <thead
            className={classnames('border-b', {
              'border-on-surface': on === ON.SURFACE,
            })}
          >
            <Tr on={on}>
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
                <tr key={idx}>
                  {columns.map(function (column) {
                    return (
                      <td key={column.key}>
                        <Cell on={on} value={data[column.key]} />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Table;

const Tr: React.FC<{ on: On }> = ({ on, children }) => {
  return (
    <tr
      className={classnames('border-b last:border-b-0', {
        'border-on-surface': on === ON.SURFACE,
      })}
    >
      {children}
    </tr>
  );
};

const Th: React.FC<{ on: On; column: Column }> = ({ column }) => {
  return <th>{column.title}</th>;
};

const Cell: React.FC<{ on: On; value: Value }> = ({ value }) => {
  return <div>{value}</div>;
};
