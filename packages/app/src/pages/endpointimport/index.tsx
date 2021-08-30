import classnames from 'classnames';
import { navigate, PageProps } from 'gatsby';
import { parse } from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import Error from '$components/error';
import Metadata from '$components/metadata';
import { ON, StatusCode } from '$constants/index';
import { BaseError, getHTTPError, NetworkError, OASError } from '$errors/index';
import useTheme from '$hooks/theme';
import Layout, { Props as LayoutProps } from '$layouts/index';
import { listState as endpointListState } from '$store/atoms/endpoint';
import {
  AuthConfigsResponse,
  Endpoint,
  EndpointForDistribution,
} from '$types/index';
import { promiseErrorHandler } from '$utils/index';
import { lint, resolve } from '$utils/oas';
import Appbar from './_parts/_appbar/index';
import Navigation from './_parts/_navigation/index';

type Props = PageProps;
const EndpointImportPagge: React.FC<Props> = ({ location }) => {
  useTheme();
  const [, setEndpointList] = useRecoilState(endpointListState);

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
              authConfigs: null,
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
              document: null,
            };
            return [...currVal, _endpoint];
          });
          navigate('/dashboard');
          return;
        }
        if (!response.ok) {
          const error = getHTTPError(response.status as StatusCode);
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

  const renderAppBar = useCallback<NonNullable<LayoutProps['renderAppBar']>>(
    function (args) {
      return <Appbar {...args} />;
    },
    []
  );

  const renderNavigation = useCallback<
    NonNullable<LayoutProps['renderNavigation']>
  >(function (args) {
    return <Navigation {...args} />;
  }, []);

  const renderBody = useCallback<LayoutProps['renderBody']>(
    function ({ className = '' }) {
      if (isPending) {
        return (
          <div className={classnames('p-2', className)}>TODO: pending...</div>
        );
      }
      if (error) {
        return <Error on={ON.BACKGROUND} error={error} />;
      }
      // TODO: 自動でnavigateするのでこれが表示されることはないはず。
      return <div>TODO: import完了</div>;
    },
    [isPending, error]
  );

  return (
    <>
      <Metadata title="Import" />
      <Layout
        renderAppBar={renderAppBar}
        renderNavigation={renderNavigation}
        renderBody={renderBody}
      />
    </>
  );
};
export default EndpointImportPagge;
