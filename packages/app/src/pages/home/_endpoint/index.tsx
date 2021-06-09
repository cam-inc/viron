import { AiFillApi } from '@react-icons/all-files/ai/AiFillApi';
import { AiFillDelete } from '@react-icons/all-files/ai/AiFillDelete';
import { navigate } from 'gatsby';
import QRCode from 'qrcode';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { listState } from '$store/atoms/endpoint';
import { oneState } from '$store/selectors/endpoint';
import { Endpoint as EndpointType, EndpointID } from '$types/index';
import { promiseErrorHandler } from '$utils/index';
import { Email, OAuth, Signout } from '../_auth/index';

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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(
    function () {
      const canvasElement = canvasRef.current;
      if (!canvasElement) {
        return;
      }
      const _endpoint: EndpointType = {
        ...endpoint,
        document: null,
      };
      const data = `${
        new URL(location.href).origin
      }/endpointimport?endpoint=${JSON.stringify(_endpoint)}`;
      console.log(data);
      QRCode.toCanvas(canvasElement, data, function (error: Error) {
        if (!!error) {
          // TODO
          console.error(error);
        }
      });
    },
    [endpoint, canvasRef.current]
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

  const handleSignout = function () {
    setIsSigninRequired(true);
  };

  return (
    <div className="p-2 border rounded text-xxs">
      <p>ID: {endpoint.id}</p>
      <p>URL: {endpoint.url}</p>
      <p>isPrivate: {endpoint.isPrivate.toString()}</p>
      <div>
        <canvas ref={canvasRef} />
      </div>
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
              {endpoint.authConfigs
                .filter((authConfig) => authConfig.type !== 'signout')
                .map((authConfig, idx) => {
                  let elm: JSX.Element | null = null;
                  switch (authConfig.type) {
                    case 'oauth':
                      elm = (
                        <OAuth authConfig={authConfig} endpoint={endpoint} />
                      );
                      break;
                    case 'email':
                      elm = (
                        <Email authConfig={authConfig} endpoint={endpoint} />
                      );
                      break;
                  }
                  return <React.Fragment key={idx}>{elm}</React.Fragment>;
                })}
            </React.Fragment>
          )}
          {endpoint.isPrivate && !isSigninRequired && (
            <React.Fragment>
              <button onClick={handleConnectButtonClick}>
                <AiFillApi className="inline" />
                <span>connect</span>
              </button>
              {endpoint.authConfigs
                .filter((authConfig) => authConfig.type === 'signout')
                .map((authConfig, idx) => (
                  <React.Fragment key={idx}>
                    <Signout
                      authConfig={authConfig}
                      endpoint={endpoint}
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
