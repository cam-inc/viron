import { AlertCircleIcon } from 'lucide-react';
import React from 'react';
import { Props as BaseProps } from '~/components';
import CommonMark from '~/components/commonMark';
import ExternalDocs from '~/components/externalDocs';
import Server from '~/components/server';
import { Badge } from '~/components/ui/badge';
import { Document, Operation } from '~/types/oas';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type Props = BaseProps & {
  document: Document;
  operation: Operation;
};
const _Operation: React.FC<Props> = ({ on, operation, className = '' }) => {
  return (
    <div className={className}>
      <div className="flex flex-col gap-1">
        {operation.deprecated && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>deprecated</AlertDescription>
          </Alert>
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
              <Badge variant="outline" key={idx}>
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {operation.servers && (
          <div className="flex items-center gap-2">
            {operation.servers.map((server, idx) => (
              <React.Fragment key={idx}>
                <Server on={on} server={server} />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default _Operation;
