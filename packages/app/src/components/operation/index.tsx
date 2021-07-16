import classnames from 'classnames';
import React from 'react';
import CommonMark from '$components/commonMark';
import ExternalDocs from '$components/externalDocs';
import OperationTag from '$components/operationTag';
import Server from '$components/server';
import { On, ON } from '$constants/index';
import { ClassName } from '$types/index';
import { Document, Operation } from '$types/oas';

type Props = {
  on: On;
  document: Document;
  operation: Operation;
  className?: ClassName;
};
const _Operation: React.FC<Props> = ({
  on,
  document,
  operation,
  className = '',
}) => {
  return (
    <div
      className={classnames('', className, {
        'text-on-background': on === ON.BACKGROUND,
        'text-on-surface': on === ON.SURFACE,
        'text-on-primary': on === ON.PRIMARY,
        'text-on-complementary': on === ON.COMPLEMENTARY,
      })}
    >
      {operation.deprecated && (
        <div className="text-xs font-bold">deprecated</div>
      )}
      {operation.summary && <div className="text-xxs">{operation.summary}</div>}
      {operation.description && (
        <CommonMark on={on} data={operation.description} />
      )}
      {operation.externalDocs && (
        <ExternalDocs on={on} data={operation.externalDocs} />
      )}
      {operation.tags && (
        <div className="flex items-center">
          {operation.tags.map(function (operationTag) {
            return (
              <React.Fragment key={operationTag}>
                <OperationTag
                  className="mr-2 last:mr-0"
                  on={on}
                  operationTag={operationTag}
                  documentTags={document.tags}
                />
              </React.Fragment>
            );
          })}
        </div>
      )}
      {operation.servers && (
        <div className="flex items-center">
          {operation.servers.map(function (server, idx) {
            return (
              <React.Fragment key={idx}>
                <Server className="mr-2 last:mr-0" on={on} server={server} />
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default _Operation;
