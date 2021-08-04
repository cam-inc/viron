import { BiDownload } from '@react-icons/all-files/bi/BiDownload';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import Button from '$components/button';
import Error from '$components/error';
import Modal, { useModal } from '$components/modal';
import { ON, STATUS_CODE } from '$constants/index';
import {
  BaseError,
  FileReaderError,
  HTTPUnexpectedError,
  NetworkError,
  OASError,
} from '$errors/index';
import { listState as endpointListState } from '$store/atoms/endpoint';
import {
  AuthConfig,
  ClassName,
  Endpoint,
  EndpointForDistribution,
} from '$types/index';
import { promiseErrorHandler } from '$utils/index';
import { lint, resolve } from '$utils/oas';

type Props = {
  className?: ClassName;
};
const Import: React.FC<Props> = ({ className = '' }) => {
  const [, setEndpointList] = useRecoilState(endpointListState);
  const inputElmRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<BaseError | null>(null);
  const modal = useModal();

  const handleButtonClick = useCallback(function () {
    inputElmRef.current?.click();
  }, []);

  const handleInputChange = useCallback(function (
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const inputElement = e.currentTarget;
    if (!inputElement.files || !inputElement.files.length) {
      return;
    }
    const file = inputElement.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      if (typeof reader.result !== 'string') {
        setError(new FileReaderError('Invalid file type.'));
        return;
      }
      let endpointList: EndpointForDistribution[] = [];
      try {
        endpointList = JSON.parse(reader.result);
      } catch {
        setError(new FileReaderError('Invalid file data.'));
        return;
      }
      // TODO: 良い感じにsrc/pages/home/_add/index.tsxと処理を統一したい。
      Promise.all(
        endpointList.map<Promise<void>>(function (endpoint) {
          const f = async function () {
            // Check whether the endpoint exists or not.
            const [response, responseError] = await promiseErrorHandler(
              fetch(endpoint.url, {
                mode: 'cors',
              })
            );
            if (responseError) {
              // 稀なケース。エクスポート後にエンドポイントurlを変更した際などに。
              setError(new NetworkError(responseError.message));
              return;
            }
            if (response.ok) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const document: Record<string, any> = await response.json();
              const { isValid } = lint(document);
              if (!isValid) {
                setError(
                  new OASError('The OAS Document is not of version we support.')
                );
                return;
              }
              setEndpointList(function (currVal) {
                // ID duplication check.
                let { id } = endpoint;
                if (
                  !!currVal.find(function (endpoint) {
                    return endpoint.id === id;
                  })
                ) {
                  id = `${id}-${Math.random()}`;
                }
                const _endpoint: Endpoint = {
                  ...endpoint,
                  id,
                  isPrivate: false,
                  authConfigs: null,
                  document: resolve(document),
                };
                return [...currVal, _endpoint];
              });
              return;
            }
            if (!response.ok && response.status === STATUS_CODE.UNAUTHORIZED) {
              const authconfigsPath = response.headers.get(
                'x-viron-authtypes-path'
              );
              // TODO: 値のundefinedチェックに加えて、値の妥当性もチェックすること。
              if (!authconfigsPath) {
                setError(
                  new BaseError(
                    'The x-viron-authtypes-path response header is missing.'
                  )
                );
                return;
              }
              const [authconfigsResponse, authconfigsResponseError] =
                await promiseErrorHandler(
                  fetch(`${new URL(endpoint.url).origin}${authconfigsPath}`, {
                    mode: 'cors',
                  })
                );
              if (!!authconfigsResponseError) {
                // Network error.
                setError(
                  new BaseError(
                    `Couldn't establish a connection to ${
                      new URL(endpoint.url).origin
                    }${authconfigsPath}.`
                  )
                );
                return;
              }
              // TODO: GET /authconfigsのレスポンスをフラットなAuthConfig[]に変更したい。
              const authConfigs: { list: AuthConfig[] } =
                await authconfigsResponse.json();
              // TODO: authConfigs.list値の妥当性をチェックする。
              setEndpointList(function (currVal) {
                // ID duplication check.
                let { id } = endpoint;
                if (
                  !!currVal.find(function (endpoint) {
                    return endpoint.id === id;
                  })
                ) {
                  id = `${id}-${Math.random()}`;
                }
                const _endpoint: Endpoint = {
                  ...endpoint,
                  id,
                  isPrivate: true,
                  authConfigs: authConfigs.list,
                  document: null,
                };
                return [...currVal, _endpoint];
              });
              return;
            }

            // Something went wrong.
            // response.ok is false and response.status is other than 401.
            setError(new HTTPUnexpectedError());
          };
          return f();
        })
      ).catch(function (error: Error) {
        setError(new FileReaderError(error.message));
      });
    };
    reader.onerror = function () {
      setError(new FileReaderError((reader.error as DOMException).message));
    };
  },
  []);

  useEffect(
    function () {
      if (error) {
        modal.open();
      } else {
        modal.close();
      }
    },
    [error, modal.open, modal.close]
  );

  return (
    <>
      <Button
        variant="ghost"
        size="xs"
        on="primary"
        Icon={BiDownload}
        label="Import"
        className={className}
        onClick={handleButtonClick}
      />
      <input
        className="hidden"
        type="file"
        ref={inputElmRef}
        onChange={handleInputChange}
      />
      <Modal {...modal.bind}>
        <Error on={ON.SURFACE} error={error as BaseError} />
      </Modal>
    </>
  );
};
export default Import;
