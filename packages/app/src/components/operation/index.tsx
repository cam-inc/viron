import { BiErrorCircle } from '@react-icons/all-files/bi/BiErrorCircle';
import { BiPurchaseTagAlt } from '@react-icons/all-files/bi/BiPurchaseTagAlt';
import classnames from 'classnames';
import React from 'react';
import CommonMark from '$components/commonMark';
import ExternalDocs from '$components/externalDocs';
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
const _Operation: React.FC<Props> = ({ on, operation, className = '' }) => {
  return (
    <div
      className={classnames('', className, {
        'text-on-background': on === ON.BACKGROUND,
        'text-on-surface': on === ON.SURFACE,
        'text-on-primary': on === ON.PRIMARY,
        'text-on-complementary': on === ON.COMPLEMENTARY,
      })}
    >
      <div className="flex flex-col gap-1">
        {operation.deprecated && (
          <div className="flex">
            <div className="flex gap-2 items-center p-2 bg-error text-on-error rounded text-xs">
              <BiErrorCircle />
              <div>deprecated</div>
            </div>
          </div>
        )}
        {operation.summary && (
          <div className="text-base font-bold">{operation.summary}</div>
        )}
        {operation.description && (
          <CommonMark on={on} data={operation.description} />
        )}
        {operation.externalDocs && (
          <div className="flex">
            <ExternalDocs on={on} data={operation.externalDocs} />
          </div>
        )}
        {operation.tags && (
          <div className="flex items-center gap-2">
            {operation.tags.map(function (tag, idx) {
              return (
                <React.Fragment key={idx}>
                  <div
                    className={classnames(
                      'flex items-center gap-1 px-1 border rounded',
                      {
                        'text-on-background-low border-on-background-low':
                          on === ON.BACKGROUND,
                        'text-on-surface-low border-on-surface-low':
                          on === ON.SURFACE,
                        'text-on-primary-low border-on-primary-low':
                          on === ON.PRIMARY,
                        'text-on-complementary-low border-on-complementary-low':
                          on === ON.COMPLEMENTARY,
                      }
                    )}
                  >
                    <BiPurchaseTagAlt />
                    <div>{tag}</div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
        {operation.servers && (
          <div className="flex items-center gap-2">
            {operation.servers.map(function (server, idx) {
              return (
                <React.Fragment key={idx}>
                  <Server className="" on={on} server={server} />
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default _Operation;
