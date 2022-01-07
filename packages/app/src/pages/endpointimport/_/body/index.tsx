import { navigate } from 'gatsby';
import { parse } from 'query-string';
import React, { useEffect, useState } from 'react';
import Error from '~/components/error';
import { HTTPStatusCode } from '~/constants/index';
import {
  BaseError,
  getHTTPError,
  NetworkError,
  OASError,
} from '~/errors/index';
import { Props as LayoutProps } from '~/layouts';
import { useEndpointListGlobalStateSet } from '~/store';
import {
  AuthConfigsResponse,
  COLOR_SYSTEM,
  Endpoint,
  EndpointForDistribution,
} from '~/types';
import { promiseErrorHandler } from '~/utils';
import { lint, resolve } from '~/utils/oas';

export type Props = Parameters<LayoutProps['renderBody']>[0];
const Body: React.FC<Props> = ({ className = '' }) => {
  const setEndpointList = useEndpointListGlobalStateSet();

  const [error, setError] = useState<BaseError | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);

  // TODO: 良い感じにsrc/pages/dashboard/_add/index.tsxと処理を統一したい。
  useEffect(
    function () {
      const queries = parse(location.search);
      let endpoint: EndpointForDistribution;
      try {
        endpoint = JSON.parse(
          queries.endpoint as string
        ) as EndpointForDistribution;
      } catch {
        setError(new BaseError('TODO'));
        setIsPending(false);
        return;
      }

      const f = async function (): Promise<void> {
        // Check whether the endpoint exists or not.
        const [response, responseError] = await promiseErrorHandler(
          fetch(endpoint.url, {
            mode: 'cors',
          })
        );
        if (!!responseError) {
          setError(new NetworkError());
          setIsPending(false);
          return;
        }
        if (response.ok) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const document: Record<string, any> = await response.json();
          const { isValid, errors } = lint(document);
          if (!isValid) {
            setError(new OASError(errors?.[0]?.message));
            setIsPending(false);
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
              document: resolve(document),
            };
            return [...currVal, _endpoint];
          });
          navigate('/dashboard');
          return;
        }
        if (!response.ok && response.status === 401) {
          const authconfigsPath = response.headers.get(
            'x-viron-authtypes-path'
          );
          // TODO: 値のundefinedチェックに加えて、値の妥当性もチェックすること。
          if (!authconfigsPath) {
            // TODO: エラー表示。Viron仕様上、'x-viron-authtypes-path'レスポンスヘッダーは必須。
            return;
          }
          const [authconfigsResponse, authconfigsResponseError] =
            await promiseErrorHandler(
              fetch(`${new URL(endpoint.url).origin}${authconfigsPath}`, {
                mode: 'cors',
              })
            );
          if (!!authconfigsResponseError) {
            setError(new NetworkError());
            setIsPending(false);
            return;
          }
          const authConfigs: AuthConfigsResponse =
            await authconfigsResponse.json();
          // TODO: authConfigs値の妥当性をチェックする。
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
              authConfigs,
            };
            return [...currVal, _endpoint];
          });
          navigate('/dashboard');
          return;
        }
        if (!response.ok) {
          const error = getHTTPError(response.status as HTTPStatusCode);
          setError(error);
          setIsPending(false);
          return;
        }
        setError(new BaseError());
        setIsPending(false);
      };
      f();
    },
    [location, setEndpointList]
  );

  if (isPending) {
    return (
      <div className={className}>
        <div className="p-2">TODO: pending...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className={className}>
        <div className="p-2">
          <Error on={COLOR_SYSTEM.BACKGROUND} error={error} />;
        </div>
      </div>
    );
  }

  // TODO: 自動でnavigateするのでこれが表示されることはないはず。
  return (
    <div className={className}>
      <div className="p-2">
        <div>TODO: import完了</div>;
      </div>
    </div>
  );
};
export default Body;
