import classnames from 'classnames';
import React, { useCallback } from 'react';
import { Props as BaseProps } from '~/components';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronUpIcon from '~/components/icon/chevronUp/outline';
import Popover, { usePopover } from '~/portals/popover';
import { useAppScreenGlobalStateValue } from '~/store';
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
