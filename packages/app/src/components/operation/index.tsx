import classnames from 'classnames';
import { TriangleAlertIcon, TagIcon } from 'lucide-react';
import React from 'react';
import { Props as BaseProps } from '~/components';
import CommonMark from '~/components/commonMark';
import ExternalDocs from '~/components/externalDocs';
import Server from '~/components/server';
import { Document, Operation } from '~/types/oas';

type Props = BaseProps & {
  document: Document;
  operation: Operation;
};
const _Operation: React.FC<Props> = ({ on, operation, className = '' }) => {
  return (
    <div className={classnames('', `text-thm-on-${on}`, className)}>
      <div className="flex flex-col gap-1">
        {operation.deprecated && (
          <div className="flex">
            <div className="flex gap-2 items-center p-2 bg-error text-thm-on-error rounded text-xs">
              <TriangleAlertIcon className="w-em" />
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
            {operation.tags.map((tag, idx) => (
              <React.Fragment key={idx}>
                <div
                  className={classnames(
                    'flex items-center gap-1 px-1 border rounded',
                    `text-thm-on-${on}-low border-thm-on-${on}-low`
                  )}
                >
                  <TagIcon className="w-em" />
                  <div>{tag}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
        {operation.servers && (
          <div className="flex items-center gap-2">
            {operation.servers.map((server, idx) => (
              <React.Fragment key={idx}>
                <Server className="" on={on} server={server} />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default _Operation;
