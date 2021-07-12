import React, { useCallback, useMemo, useState } from 'react';
import Drawer, { useDrawer } from '$components/drawer';
import Error from '$components/error';
import Table, { Props as TableProps } from '$components/table';
import { ON } from '$constants/index';
import { BaseError } from '$errors/index';
import { Document, Info } from '$types/oas';
import {
  getContentBaseOperationResponseKeys,
  getTableSetting,
} from '$utils/oas';
import { UseDescendantsReturn } from '../../_hooks/useDescendants';
import Descendant, { Props as DescendantProps } from '../../_parts/descendant';

// TODO: ソート機能とフィルター機能

type Props = {
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  descendants: UseDescendantsReturn;
  onDescendantOperationSuccess: DescendantProps['onOperationSuccess'];
  onDescendantOperationFail: DescendantProps['onOperationFail'];
};
const _ContentTable: React.FC<Props> = ({
  document,
  content,
  data,
  descendants,
  onDescendantOperationSuccess,
  onDescendantOperationFail,
}) => {
  const [error, setError] = useState<BaseError | null>(null);
  const fields = useMemo<
    ReturnType<typeof getContentBaseOperationResponseKeys>
  >(
    function () {
      return getContentBaseOperationResponseKeys(document, content);
    },
    [document]
  );

  const columns = useMemo<TableProps['columns']>(
    function () {
      const _columns: TableProps['columns'] = [];
      fields.forEach(function (field) {
        _columns.push({
          type: field.type,
          name: field.name,
          key: field.name,
        });
      });
      return _columns;
    },
    [fields]
  );

  const dataSource = useMemo<TableProps['dataSource']>(
    function () {
      const _dataSource: TableProps['dataSource'] = [];
      const getTableSettingResult = getTableSetting(document.info);
      if (getTableSettingResult.isFailure()) {
        setError(getTableSettingResult.value);
        return _dataSource;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data[getTableSettingResult.value.responseListKey].forEach(function (
        responseListItem: any
      ) {
        // TODO: response['200'].content['application/json'].schema.properties[{responseListKey}].items.typeって、objectかもしれないしnumberかもしれないよ。
        const item: TableProps['dataSource'][number] = {};
        fields.forEach(function (field) {
          item[field.name] = responseListItem[field.name];
        });
        _dataSource.push(item);
      });
      return _dataSource;
    },
    [document, data, fields]
  );

  const renderActions = useCallback<NonNullable<TableProps['renderActions']>>(
    function (data) {
      return (
        <div className="flex items-center">
          {descendants.map(function (descendant, idx) {
            return (
              <div key={idx}>
                <Descendant
                  descendant={descendant}
                  data={data}
                  onOperationSuccess={onDescendantOperationSuccess}
                  onOperationFail={onDescendantOperationFail}
                />
              </div>
            );
          })}
        </div>
      );
    },
    [descendants, onDescendantOperationSuccess, onDescendantOperationFail]
  );

  const drawer = useDrawer();
  const handleTableRowClick = useCallback<TableProps['onRowClick']>(
    function () {
      drawer.open();
    },
    [drawer]
  );

  if (error) {
    return <Error error={error} />;
  }

  return (
    <>
      <Table
        on={ON.SURFACE}
        columns={columns}
        dataSource={dataSource}
        renderActions={descendants.length ? renderActions : undefined}
        onRowClick={handleTableRowClick}
      />
      <Drawer {...drawer.bind}>TODO</Drawer>
    </>
  );
};
export default _ContentTable;
