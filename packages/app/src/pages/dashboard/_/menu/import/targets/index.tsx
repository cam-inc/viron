import classnames from 'classnames';
import {
  CircleArrowDownIcon,
  CircleCheckIcon,
  ImportIcon,
  AlertTriangleIcon,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import Head from '~/components/head';
import Spinner from '~/components/spinner';
import { Button } from '~/components/ui/button';
import { BaseError } from '~/errors';
import { useEndpoint } from '~/hooks/endpoint';
import { COLOR_SYSTEM, Endpoint, EndpointGroup } from '~/types';

export type Props = {
  endpointList: Endpoint[];
  endpointGroupList: EndpointGroup[];
};
const Targets: React.FC<Props> = ({ endpointList }) => {
  return (
    <ul className="flex flex-col">
      {endpointList.map((endpoint, idx) => (
        <li
          key={idx}
          className="py-4 border-b last:border-b-0 border-dotted border-thm-on-surface-slight"
        >
          <Target endpoint={endpoint} />
        </li>
      ))}
    </ul>
  );
};
export default Targets;

const Target: React.FC<{
  endpoint: Endpoint;
}> = ({ endpoint }) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [error, setError] = useState<BaseError | null>(null);
  const { connect, addEndpoint } = useEndpoint();

  const handleImportClick = useCallback(async () => {
    if (isPending || isDone) {
      return;
    }
    setIsPending(true);
    const connection = await connect(endpoint.url);
    if (connection.error) {
      setError(connection.error);
      setIsPending(false);
      setIsDone(true);
      return;
    }
    const addition = await addEndpoint(endpoint, { resolveDuplication: true });
    setError(addition.error);
    setIsPending(false);
    setIsDone(true);
  }, [isPending, isDone, connect, addEndpoint, endpoint]);

  return (
    <div className="flex items-center gap-4 border-l-4 border-thm-primary pl-4">
      <div className="flex-1 flex flex-col gap-1">
        <div className="text-sm text-thm-on-surface">{endpoint.id}</div>
        <div className="text-xs text-thm-on-surface-low">{endpoint.url}</div>
      </div>
      <div className="flex-none">
        {isDone ? (
          <div
            className={classnames(
              'flex items-center gap-2 text-thm-on-surface-low',
              {
                'text-thm-on-surface-low': error,
                'text-thm-on-surface': !error,
              }
            )}
          >
            <div>
              {error ? (
                <AlertTriangleIcon className="w-8" />
              ) : (
                <CircleCheckIcon className="w-8" />
              )}
            </div>
          </div>
        ) : (
          <>
            {isPending ? (
              <Spinner className="w-4" on={COLOR_SYSTEM.SURFACE} />
            ) : (
              <Button onClick={handleImportClick}>
                <CircleArrowDownIcon />
                Import
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
