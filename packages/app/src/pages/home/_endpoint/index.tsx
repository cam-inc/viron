import { AiFillApi } from '@react-icons/all-files/ai/AiFillApi';
import { AiFillDelete } from '@react-icons/all-files/ai/AiFillDelete';
import { navigate } from 'gatsby';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Auth from '$components/auth';
import { listState } from '$store/atoms/endpoint';
import { oneState } from '$store/selectors/endpoint';
import { AuthType, AuthTypeEmailFormData, EndpointID } from '$types/index';
import { promiseErrorHandler } from '$utils/index';

type Props = {
  id: EndpointID;
};
const Endpoint: React.FC<Props> = ({ id }) => {
  const [endpoint] = useRecoilState(oneState({ id }));
  const setEndpoints = useSetRecoilState(listState);

  if (!endpoint) {
    throw new Error('Endoint Not Found.');
  }

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
        if (!response.ok && response.status === 401) {
          setIsSigninRequired(true);
          setIsPending(false);
          return;
        }
        // TODO: show error.
        return;
      };
      f();
    },
    [setIsSigninRequired, setIsPending]
  );

  const handleDeleteButtonClick = function (): void {
    setEndpoints(function (currVal) {
      return currVal.filter(function (_endpoint) {
        return _endpoint.id !== endpoint.id;
      });
    });
  };

  const handleConnectButtonClick = function () {
    navigate(`/endpoints/${endpoint.id}`);
  };

  const handleOAuthSignin = function (authType: AuthType) {
    const origin = new URL(endpoint.url).origin;
    const redirectUrl = encodeURIComponent(
      `${new URL(location.href).origin}/oauthredirect/${endpoint.id}`
    );
    const fetchUrl = `${origin}${authType.url}?redirect_url=${redirectUrl}`;
    location.href = fetchUrl;
  };

  const handleEmailSignin = function (
    authType: AuthType,
    data: AuthTypeEmailFormData
  ) {
    const f = async function (): Promise<void> {
      const [response, responseError] = await promiseErrorHandler(
        // TODO: path objectを参照すること。
        fetch(`${new URL(endpoint.url).origin}${authType.url}`, {
          method: authType.method,
          body: JSON.stringify(data),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      if (!!responseError) {
        // TODO
        return;
      }
      if (!response.ok) {
        // TODO
        return;
      }
      navigate(`/endpoints/${endpoint.id}`);
    };
    f();
  };

  const handleSignout = function (authType: AuthType) {
    const f = async function (): Promise<void> {
      const [response, responseError] = await promiseErrorHandler(
        // TODO: path objectを参照すること。
        fetch(`${new URL(endpoint.url).origin}${authType.url}`, {
          method: authType.method,
          credentials: 'include',
        })
      );
      if (!!responseError) {
        // TODO
        return;
      }
      if (!response.ok) {
        // TODO
        return;
      }
      setIsSigninRequired(true);
    };
    f();
  };

  return (
    <div className="p-2 border rounded text-xxs">
      <p>ID: {endpoint.id}</p>
      <p>URL: {endpoint.url}</p>
      <p>isPrivate: {endpoint.isPrivate.toString()}</p>
      <button onClick={handleDeleteButtonClick}>
        <AiFillDelete className="inline" />
        <span>remove</span>
      </button>
      {isPending ? (
        <p>pending...</p>
      ) : (
        <React.Fragment>
          {!endpoint.isPrivate && (
            <button onClick={handleConnectButtonClick}>
              <AiFillApi className="inline" />
              <span>connect</span>
            </button>
          )}
          {endpoint.isPrivate && isSigninRequired && (
            <React.Fragment>
              {endpoint.authTypes
                .filter((authType) => authType.type !== 'signout')
                .map((authType) => (
                  <React.Fragment key={authType.type}>
                    <Auth
                      authType={authType}
                      onOAuthSignin={handleOAuthSignin}
                      onEmailSignin={handleEmailSignin}
                      onSignout={handleSignout}
                    />
                  </React.Fragment>
                ))}
            </React.Fragment>
          )}
          {endpoint.isPrivate && !isSigninRequired && (
            <React.Fragment>
              <button onClick={handleConnectButtonClick}>
                <AiFillApi className="inline" />
                <span>connect</span>
              </button>
              {endpoint.authTypes
                .filter((authType) => authType.type === 'signout')
                .map((authType, idx) => (
                  <React.Fragment key={idx}>
                    <Auth
                      authType={authType}
                      onOAuthSignin={handleOAuthSignin}
                      onEmailSignin={handleEmailSignin}
                      onSignout={handleSignout}
                    />
                  </React.Fragment>
                ))}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default Endpoint;
