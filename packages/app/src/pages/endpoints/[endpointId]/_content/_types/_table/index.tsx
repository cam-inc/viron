import React from 'react';
import Error from '$components/error';
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
  const getTableSettingResult = getTableSetting(document.info);
  if (getTableSettingResult.isFailure()) {
    return <Error error={getTableSettingResult.value} />;
  }
  const tableSetting = getTableSettingResult.value;

  const fields = getContentBaseOperationResponseKeys(document, content);
  // TODO: OASが修正されるまでの暫定対応
  if (content.operationId === 'listPurchases') {
    fields.push(
      ...[
        'amount',
        'createdAt',
        'id',
        'itemId',
        'unitPrice',
        'updatedAt',
        'userId',
      ]
    );
  }
  // TODO: response['200'].content['application/json'].schema.properties[{responseListKey}].items.typeって、objectかもしれないしnumberかもしれないよ。
  const list: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key in string]: any;
  }[] = data[tableSetting.responseListKey];

  return (
    <div>
      <ul>
        {list.map(function (item, idx) {
          return (
            <React.Fragment key={idx}>
              <li>
                <div>
                  <p>{idx}:</p>
                  <ul>
                    {descendants.map(function (descendant, idx) {
                      return (
                        <React.Fragment key={idx}>
                          <li>
                            <Descendant
                              descendant={descendant}
                              data={item}
                              onOperationSuccess={onDescendantOperationSuccess}
                              onOperationFail={onDescendantOperationFail}
                            />
                          </li>
                        </React.Fragment>
                      );
                    })}
                  </ul>
                  {fields.map(function (field, idx) {
                    return (
                      <React.Fragment key={idx}>
                        <span>
                          {field}:{item[field]}
                        </span>
                      </React.Fragment>
                    );
                  })}
                </div>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};
export default _ContentTable;
