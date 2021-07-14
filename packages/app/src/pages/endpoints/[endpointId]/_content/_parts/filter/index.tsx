import { BiFilterAlt } from '@react-icons/all-files/bi/BiFilterAlt';
import classnames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import Button from '$components/button';
import Drawer, { useDrawer } from '$components/drawer';
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
  const drawer = useDrawer();
  const handleClick = useCallback(
    function () {
      drawer.open();
    },
    [drawer]
  );

  const columns = useMemo<TableColumn[]>(function () {
    return getTableColumns(document, content);
  }, []);

  const handleItemClick = useCallback(
    function (e: React.MouseEvent<HTMLElement>) {
      const key = e.currentTarget.dataset['key'] as string;
      if (omitted.includes(key)) {
        onChange(
          omitted.filter(function (item) {
            return item !== key;
          })
        );
      } else {
        onChange([...omitted, key]);
      }
    },
    [omitted, onChange]
  );

  return (
    <>
      <Button
        on={ON.SURFACE}
        variant="text"
        Icon={BiFilterAlt}
        onClick={handleClick}
      />
      <Drawer {...drawer.bind}>
        <div>
          {columns.map(function (column) {
            return (
              <div
                key={column.key}
                data-key={column.key}
                onClick={handleItemClick}
              >
                <div
                  className={classnames({
                    'font-bold': !omitted.includes(column.key),
                  })}
                >
                  {column.key}: {column.name}
                </div>
              </div>
            );
          })}
        </div>
      </Drawer>
    </>
  );
};
export default Filter;
