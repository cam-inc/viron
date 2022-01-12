import classnames from 'classnames';
import React, { useCallback, useState } from 'react';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import ArrowCircleDownIcon from '~/components/icon/arrowCircleDown/outline';
import CheckCircleIcon from '~/components/icon/checkCircle/outline';
import ExclamationIcon from '~/components/icon/exclamation/outline';
import Spinner from '~/components/spinner';
import { BaseError } from '~/errors';
import { useEndpoint } from '~/hooks/endpoint';
import { COLOR_SYSTEM, Endpoint, EndpointGroup } from '~/types';

export type Props = {
  endpointList: Endpoint[];
  endpointGroupList: EndpointGroup[];
};
const Targets: React.FC<Props> = ({ endpointList, endpointGroupList }) => {
  return (
    <div>
      <p className="mb-4 text-sm text-thm-on-surface">
        Click import button to add an endpoint into your dashboard.
      </p>
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
    </div>
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

  const handleImportClick = useCallback<
    FilledButtonProps['onClick']
  >(async () => {
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
    <div className="flex items-center gap-4 border-l-4 border-thm-on-surface-slight pl-4">
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
                <ExclamationIcon className="w-8" />
              ) : (
                <CheckCircleIcon className="w-8" />
              )}
            </div>
          </div>
        ) : (
          <>
            {isPending ? (
              <Spinner className="w-4" on={COLOR_SYSTEM.SURFACE} />
            ) : (
              <FilledButton
                cs={COLOR_SYSTEM.PRIMARY}
                label="Import"
                Icon={ArrowCircleDownIcon}
                size={BUTTON_SIZE.XS}
                onClick={handleImportClick}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
