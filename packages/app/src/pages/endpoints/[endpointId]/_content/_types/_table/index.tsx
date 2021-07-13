import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import Drawer, { useDrawer } from '$components/drawer';
import Error from '$components/error';
import Table, { Props as TableProps } from '$components/table';
import { ON } from '$constants/index';
import { BaseError } from '$errors/index';
import { Document, Info, RequestValue, Sort } from '$types/oas';
import {
  getContentBaseOperationResponseKeys,
  getTableSetting,
} from '$utils/oas';
import { UseBaseReturn } from '../../_hooks/useBase';
import { UseDescendantsReturn } from '../../_hooks/useDescendants';
import Descendant, { Props as DescendantProps } from '../../_parts/descendant';

// TODO: ソート機能とフィルター機能

type Props = {
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
  base: UseBaseReturn;
  descendants: UseDescendantsReturn;
  onDescendantOperationSuccess: DescendantProps['onOperationSuccess'];
  onDescendantOperationFail: DescendantProps['onOperationFail'];
};
const _ContentTable: React.FC<Props> = ({
  document,
  content,
  base,
  descendants,
  onDescendantOperationSuccess,
  onDescendantOperationFail,
}) => {
  const [error, setError] = useState<BaseError | null>(null);
  const [sorts, setSorts] = useState<
    Record<
      TableProps['columns'][number]['key'],
      TableProps['columns'][number]['sort']
    >
  >({});

  const columns = useMemo<TableProps['columns']>(
    function () {
      const _columns: TableProps['columns'] = [];
      const getTableSettingResult = getTableSetting(document.info);
      if (getTableSettingResult.isFailure()) {
        setError(getTableSettingResult.value);
        return _columns;
      }
      const isSortable = !!getTableSettingResult.value.sort;
      const fields = getContentBaseOperationResponseKeys(document, content);
      fields.forEach(function (field) {
        _columns.push({
          type: field.type,
          name: field.name,
          key: field.name,
          isSortable,
          sort: sorts[field.name],
        });
      });
      return _columns;
    },
    [document, content, sorts]
  );

  const dataSource = useMemo<TableProps['dataSource']>(
    function () {
      const _dataSource: TableProps['dataSource'] = [];
      const getTableSettingResult = getTableSetting(document.info);
      if (getTableSettingResult.isFailure()) {
        setError(getTableSettingResult.value);
        return _dataSource;
      }
      base.data[getTableSettingResult.value.responseListKey].forEach(function (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responseListItem: any
      ) {
        // TODO: response['200'].content['application/json'].schema.properties[{responseListKey}].items.typeって、objectかもしれないしnumberかもしれないよ。
        const item: TableProps['dataSource'][number] = {};
        const fields = getContentBaseOperationResponseKeys(document, content);
        fields.forEach(function (field) {
          item[field.name] = responseListItem[field.name];
        });
        _dataSource.push(item);
      });
      return _dataSource;
    },
    [document, content, base]
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

  const handleRequestSortChange = useCallback<
    NonNullable<TableProps['onRequestSortChange']>
  >(
    function (key, sort) {
      const getTableSettingResult = getTableSetting(document.info);
      if (getTableSettingResult.isFailure()) {
        setError(getTableSettingResult.value);
        return;
      }
      if (!getTableSettingResult.value.sort) {
        return;
      }
      const newSorts = _.omitBy(
        {
          ...sorts,
          [key]: sort,
        },
        function (sort) {
          return !sort;
        }
      );
      setSorts(newSorts);
      const requestValue = _.cloneDeep<RequestValue>(base.requestValue);
      // TODO: parametersかrequestBodyか、OASみて判断すること。
      requestValue.parameters = {
        ...requestValue.parameters,
        [getTableSettingResult.value.sort.requestKey]: (function (): Sort {
          const arr: string[] = [];
          _.forEach(newSorts, function (sort, key) {
            arr.push(`${key}:${sort}`);
          });
          return arr.join(',');
        })(),
      };
      base.fetch(requestValue);
    },
    [document, base, sorts]
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
        onRequestSortChange={handleRequestSortChange}
        onRowClick={handleTableRowClick}
      />
      <Drawer {...drawer.bind}>TODO</Drawer>
    </>
  );
};
export default _ContentTable;
