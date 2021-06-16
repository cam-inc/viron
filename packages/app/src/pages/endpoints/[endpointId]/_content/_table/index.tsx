import React from 'react';
import { Document, Info } from '$types/oas';
import {
  getContentBaseOperationResponseKeys,
  getTableSetting,
} from '$utils/oas';
import { UseRelatedDescendantReturn } from '../_hooks/useRelatedDescendant';

type Props = {
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
  data: any;
  relatedDescendant: UseRelatedDescendantReturn;
};
const _ContentTable: React.FC<Props> = ({ document, content, data }) => {
  return <p>明日のりたまさんに</p>;
  const tableSetting = getTableSetting(document.info);
  if (!tableSetting || !tableSetting.responseListKey) {
    throw new Error(
      'TODO: content.type="table"を使うなら必ずInfo[x-table]を定義してね！'
    );
  }
  if (!data[tableSetting.responseListKey]) {
    throw new Error(
      `TODO: レスポンスに${tableSetting.responseListKey}がないお。。`
    );
  }
  const fields = getContentBaseOperationResponseKeys(document, content);
  // TODO: ホントに必ずオブジェクトになるの？
  const list: {
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
                  <span>{idx}:</span>
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
