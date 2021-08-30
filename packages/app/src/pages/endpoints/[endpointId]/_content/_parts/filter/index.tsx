import { AiFillFilter } from '@react-icons/all-files/ai/AiFillFilter';
import { AiOutlineFilter } from '@react-icons/all-files/ai/AiOutlineFilter';
import { BiCheckbox } from '@react-icons/all-files/bi/BiCheckbox';
import { BiCheckboxSquare } from '@react-icons/all-files/bi/BiCheckboxSquare';
import classnames from 'classnames';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import Button, {
  SIZE as BUTTON_SIZE,
  VARIANT as BUTTON_VARIANT,
} from '$components/button';
import Drawer, { useDrawer } from '$components/drawer';
import Popover, { usePopover } from '$components/popover';
import { ON } from '$constants/index';
import { Document, Info, TableColumn } from '$types/oas';
import { getTableColumns } from '$utils/oas';

export type Props = {
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
  omitted: TableColumn['key'][];
  onChange: (list: Props['omitted']) => void;
};
const Filter: React.FC<Props> = ({ document, content, omitted, onChange }) => {
  const popover = usePopover<HTMLDivElement>();
  const handleMouseEnter = useCallback(
    function () {
      popover.open();
    },
    [popover]
  );
  const handleMouseLeave = useCallback(
    function () {
      popover.close();
    },
    [popover]
  );

  const columns = useMemo<TableColumn[]>(function () {
    return getTableColumns(document, content);
  }, []);

  const [newOmitted, setNewOmitted] = useState<Props['omitted']>([...omitted]);
  useEffect(
    function () {
      setNewOmitted([...omitted]);
    },
    [omitted]
  );

  const drawer = useDrawer();
  const handleButtonClick = useCallback(
    function () {
      setNewOmitted([...omitted]);
      drawer.open();
    },
    [drawer, omitted]
  );

  const handleToggleAllClick = useCallback(
    function () {
      if (newOmitted.length) {
        setNewOmitted([]);
      } else {
        setNewOmitted(
          columns.map(function (column) {
            return column.key;
          })
        );
      }
    },
    [columns, newOmitted]
  );

  const handleItemClick = useCallback(
    function (e: React.MouseEvent<HTMLElement>) {
      const key = e.currentTarget.dataset['key'] as string;
      if (newOmitted.includes(key)) {
        setNewOmitted(
          newOmitted.filter(function (item) {
            return item !== key;
          })
        );
      } else {
        setNewOmitted([...newOmitted, key]);
      }
    },
    [newOmitted]
  );

  const handleApplyClick = useCallback(
    function () {
      onChange(newOmitted);
      drawer.close();
    },
    [newOmitted, onChange, drawer]
  );

  return (
    <>
      <div
        ref={popover.targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Button
          on={ON.SURFACE}
          variant="text"
          Icon={omitted.length ? AiFillFilter : AiOutlineFilter}
          onClick={handleButtonClick}
        />
      </div>
      <Drawer {...drawer.bind}>
        <div className="h-full flex flex-col text-on-surface">
          {/* Head */}
          <div className="flex-none p-2 border-b-2 border-on-surface-faint">
            <div>Filter</div>
          </div>
          {/* Body */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-none px-2">
              <button
                className={classnames(
                  'block w-full py-2 flex items-center gap-2 border-b border-on-surface',
                  {}
                )}
                onClick={handleToggleAllClick}
              >
                {!newOmitted.length ? <BiCheckboxSquare /> : <BiCheckbox />}
                <div>Toggle All</div>
              </button>
            </div>
            <div className="px-2 pb-2 flex-1 min-h-0 overflow-y-scroll overscroll-y-contain">
              <div className="flex flex-col">
                {columns.map(function (column) {
                  return (
                    <button
                      key={column.key}
                      data-key={column.key}
                      className={classnames(
                        'py-2 flex items-center gap-2 border-b border-on-surface-faint',
                        {
                          'text-on-surface': !newOmitted.includes(column.key),
                          'text-on-surface-slight': newOmitted.includes(
                            column.key
                          ),
                        }
                      )}
                      onClick={handleItemClick}
                    >
                      {!newOmitted.includes(column.key) ? (
                        <BiCheckboxSquare />
                      ) : (
                        <BiCheckbox />
                      )}
                      <div>{column.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Tail */}
          <div className="flex-none p-2 border-t-2 border-on-surface-faint">
            <Button
              className="w-full"
              on={ON.SURFACE}
              variant={BUTTON_VARIANT.PAPER}
              size={BUTTON_SIZE.LG}
              label="apply"
              onClick={handleApplyClick}
            />
          </div>
        </div>
      </Drawer>
      <Popover {...popover.bind}>
        <div className="text-on-surface whitespace-nowrap">Filter</div>
      </Popover>
    </>
  );
};
export default Filter;
