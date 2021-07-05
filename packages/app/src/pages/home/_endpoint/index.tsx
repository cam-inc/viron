import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Endpoint } from '$types/index';
import { promiseErrorHandler } from '$utils/index';
import Enter from './_enter';
import QRCode from './_qrcode/index';
import Remove from './_remove';
import Signin from './_signin';
import Signout from './_signout';
import Thumbnail from './_thumbnail';

type Props = {
  endpoint: Endpoint;
};
const _Endpoint: React.FC<Props> = ({ endpoint }) => {
  const [isPending, setIsPending] = useState<boolean>(true);
  const [isSigninRequired, setIsSigninRequired] = useState<boolean>(false);

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
          throw new Error(responseError.message);
        }
        if (response.ok) {
          setIsSigninRequired(false);
          setIsPending(false);
          return;
        }
        if (response.status === 401 || response.status === 403) {
          setIsSigninRequired(true);
          setIsPending(false);
          return;
        }
        // TODO: show error.
        return;
      };
      f();
    },
    [endpoint, setIsSigninRequired, setIsPending]
  );

  const enter = useMemo<JSX.Element>(
    function () {
      return <Enter endpoint={endpoint} isSigninRequired={isSigninRequired} />;
    },
    [endpoint, isSigninRequired]
  );

  const signin = useMemo<JSX.Element>(
    function () {
      return <Signin endpoint={endpoint} isSigninRequired={isSigninRequired} />;
    },
    [endpoint, isSigninRequired]
  );

  const handleSignout = useCallback(
    function () {
      setIsSigninRequired(true);
    },
    [setIsSigninRequired]
  );
  const signout = useMemo<JSX.Element>(
    function () {
      return (
        <Signout
          endpoint={endpoint}
          isSigninRequired={isSigninRequired}
          onSignout={handleSignout}
        />
      );
    },
    [endpoint, isSigninRequired, handleSignout]
  );

  if (isPending) {
    return (
      <div className="p-2">
        <div>Pending...</div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="pb-2 flex items-center">
        <div className="flex-none mr-2">
          <Thumbnail className="" endpoint={endpoint} />
        </div>
        <div className="flex-1 min-w-0 mr-2">
          <div className="">{endpoint.document?.info.title || '---'}</div>
          <div className="text-on-surface-low text-xs">{endpoint.url}</div>
        </div>
        <div className="flex-none">
          <div className="flex items-center">
            <div className="mr-2 last:mr-0">
              <QRCode endpoint={endpoint} />
            </div>
            <div className="mr-2 last:mr-0">
              <Remove endpoint={endpoint} />
            </div>
            <div className="mr-2 last:mr-0">{enter}</div>
            <div className="mr-2 last:mr-0">{signin}</div>
            <div className="mr-2 last:mr-0">{signout}</div>
          </div>
        </div>
      </div>
      <div className="pt-2 border-t border-on-surface-faint">
        <div className="text-xxs">
          {endpoint.document?.info.description || '---'}
        </div>
      </div>
    </div>
  );
};

export default _Endpoint;
