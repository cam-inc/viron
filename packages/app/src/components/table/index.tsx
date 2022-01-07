import classnames from 'classnames';
import React, { useCallback } from 'react';
import { Props as BaseProps } from '~/components';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronUpIcon from '~/components/icon/chevronUp/outline';
import { TableColumn, TableSort, TABLE_SORT } from '~/types/oas';

type Key = string;
type Value = unknown;
export type Data = Record<Key, Value>;
type Column = TableColumn & {
  sort: TableSort;
};

export type Props = BaseProps & {
  dataSource: Data[];
  columns: Column[];
  renderActions?: (data: Data) => JSX.Element;
  onRowClick?: (data: Data) => void;
  onRequestSortChange?: (key: Column['key'], sort: Column['sort']) => void;
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
  const handleColumnHeadClick = useCallback<
    NonNullable<ThTitleProp['onClick']>
  >(
    (column) => {
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
    (data) => {
      onRowClick?.(data);
    },
    [onRowClick]
  );

  return (
    <div className={className}>
      <div className="overflow-x-auto overscroll-x-contain">
        <table className="min-w-full border-collapse">
          <thead
            className={classnames('border-b-2', `border-thm-on-${on}-faint`)}
          >
            <Tr on={on} isHead>
              {columns.map((column) => (
                <React.Fragment key={column.key}>
                  <Th on={on}>
                    <ThTitle
                      on={on}
                      column={column}
                      onClick={handleColumnHeadClick}
                    />
                  </Th>
                </React.Fragment>
              ))}
              {renderActions && (
                <Th on={on} isSticky>
                  <div>actions</div>
                </Th>
              )}
            </Tr>
          </thead>
          <tbody>
            {dataSource.map((data, idx) => (
              <React.Fragment key={idx}>
                <Tr on={on} data={data} onClick={handleRowClick}>
                  {columns.map((column) => (
                    <React.Fragment key={column.key}>
                      <Td on={on}>
                        <Cell
                          on={on}
                          column={column}
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
      className={classnames(`border-b border-thm-on-${on}-faint`, {
        [`hover:bg-thm-on-${on}-faint`]: !isHead,
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
      className={classnames(`text-xs text-left text-thm-on-${on}-high`, {
        'p-2': !isSticky,
        'pr-2 py-2 pl-4 sticky right-0': isSticky,
      })}
      style={style}
    >
      {children}
    </th>
  );
};

type ThTitleProp = BaseProps & {
  column: Column;
  onClick?: (column: Column) => void;
};
const ThTitle: React.FC<ThTitleProp> = ({ on, column, onClick }) => {
  const handleClick = useCallback(() => {
    onClick?.(column);
  }, [column, onClick]);
  return (
    <div className="flex items-center" onClick={handleClick}>
      <div className="flex-none mr-1">
        <div
          className={classnames({
            [`text-thm-on-${on}`]: column.sort === TABLE_SORT.ASC,
            [`text-thm-on-${on}-slight`]: column.sort !== TABLE_SORT.ASC,
          })}
        >
          <ChevronUpIcon className="w-em" />
        </div>
        <div
          className={classnames({
            [`text-thm-on-${on}`]: column.sort === TABLE_SORT.DESC,
            [`text-thm-on-${on}-slight`]: column.sort !== TABLE_SORT.DESC,
          })}
        >
          <ChevronDownIcon className="w-em" />
        </div>
      </div>
      <div className="flex-1 min-w-0 font-bold">{column.name}</div>
    </div>
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

const Cell: React.FC<BaseProps & { column: Column; value: Value }> = ({
  on,
  column,
  value,
}) => {
  /*
  const formattedValue = function(column: Column, value: Value) {
    switch (column.schema.type) {
      case 'string':
        if (column.schema.format === ('date' || 'date-time')) {
          const date = new Date(value as string);
          const intlDate = new Intl.DateTimeFormat([], {
            dateStyle: 'medium',
            timeStyle: 'medium',
          }).format(date);
          return intlDate;
        }
        return JSON.stringify(value);
      case 'number' || 'integer':
        return (value as number).toLocaleString();
      default:
        return JSON.stringify(value);
    }
  };
  */
  return (
    <>
      <div
        className={classnames(
          `text-xxs whitespace-nowrap text-thm-on-${on}-slight`
        )}
      >
        [{column.schema.type}]
      </div>
      <div className="whitespace-nowrap">
        <div className={classnames(`text-sm text-thm-on-${on}`)}>
          {/*formattedValue(column, value)*/ value as string}
        </div>
      </div>
    </>
  );
};
