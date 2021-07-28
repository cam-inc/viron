import { BiInfoCircle } from '@react-icons/all-files/bi/BiInfoCircle';
import React, { useCallback, useEffect, useState } from 'react';
import Button from '$components/button';
import Error from '$components/error';
import { ON, STATUS_CODE } from '$constants/index';
import { BaseError, HTTPUnexpectedError, NetworkError } from '$errors/index';
import { Endpoint } from '$types/index';
import { promiseErrorHandler } from '$utils/index';
import Enter from './_enter';
import QRCode from './_qrcode/index';
import Remove, { Props as RemoveProps } from './_remove';
import Signin from './_signin';
import Signout from './_signout';
import Thumbnail from './_thumbnail';

export type Props = {
  endpoint: Endpoint;
  onRemove: RemoveProps['onRemove'];
};
const _Endpoint: React.FC<Props> = ({ endpoint, onRemove }) => {
  const [isPending, setIsPending] = useState<boolean>(true);
  const [isSigninRequired, setIsSigninRequired] = useState<boolean>(false);
  const [error, setError] = useState<BaseError | null>(null);
  const [isOpened, setIsOpened] = useState<boolean>(true);

  const handleOpenerClick = useCallback(
    function () {
      setIsOpened(!isOpened);
    },
    [isOpened]
  );

  useEffect(
    function () {
      if (!endpoint.isPrivate) {
        setIsSigninRequired(false);
        setIsPending(false);
        return;
      }
      // Ping to see whether the authorization cookie is valid.
      const f = async function () {
        const [response, responseError] = await promiseErrorHandler(
          fetch(endpoint.url, {
            mode: 'cors',
            credentials: 'include',
          })
        );
        if (!!responseError) {
          const error = new NetworkError(responseError.message);
          setError(error);
          return;
        }
        if (response.ok) {
          setIsSigninRequired(false);
          setIsPending(false);
          return;
        }
        if (
          response.status === STATUS_CODE.UNAUTHORIZED ||
          response.status === STATUS_CODE.FORBIDDEN
        ) {
          setIsSigninRequired(true);
          setIsPending(false);
          return;
        }
        const error = new HTTPUnexpectedError();
        setError(error);
        return;
      };
      f();
    },
    [endpoint]
  );

  const handleSignout = useCallback(
    function () {
      setIsSigninRequired(true);
    },
    [setIsSigninRequired]
  );

  if (error) {
    return <Error on={ON.SURFACE} error={error} />;
  }

  if (isPending) {
    return (
      <div className="p-2">
        <div>Pending...</div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        <div className="flex-none">
          <Thumbnail className="" endpoint={endpoint} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-on-surface-low text-xxs">{endpoint.id}</div>
          <div className="text-on-surface-high text-xs">
            {endpoint.document?.info.title || '---'}
          </div>
        </div>
        <div className="flex-none">
          <div className="flex items-center gap-2">
            <Button
              on={ON.SURFACE}
              variant="text"
              Icon={BiInfoCircle}
              onClick={handleOpenerClick}
            />
            <QRCode endpoint={endpoint} />
            <Remove endpoint={endpoint} onRemove={onRemove} />
            <Enter endpoint={endpoint} isSigninRequired={isSigninRequired} />
            <Signin endpoint={endpoint} isSigninRequired={isSigninRequired} />
            <Signout
              endpoint={endpoint}
              isSigninRequired={isSigninRequired}
              onSignout={handleSignout}
            />
          </div>
        </div>
      </div>
      {isOpened && (
        <div className="mt-2 pt-2 border-t border-on-surface-faint">
          <div className="text-on-surface-low text-xxs">{endpoint.url}</div>
          <div className="text-xxs">
            {endpoint.document?.info.description || '---'}
          </div>
        </div>
      )}
    </div>
  );
};

export default _Endpoint;
