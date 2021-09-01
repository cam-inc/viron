import classnames from 'classnames';
import { navigate, PageProps } from 'gatsby';
import _ from 'lodash';
import { parse } from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import Error from '$components/error';
import Metadata from '$components/metadata';
import Request from '$components/request';
import { ON, HTTPStatusCode } from '$constants/index';
import { BaseError, getHTTPError, NetworkError } from '$errors/index';
import useTheme from '$hooks/theme';
import Layout, { Props as LayoutProps } from '$layouts/index';
import { KEY, get } from '$storage/index';
import { oneState as endpointOneState } from '$store/selectors/endpoint';
import { EndpointID } from '$types/index';
import { Document, Request as TypeRequest, RequestValue } from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import {
  cleanupRequestValue,
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
  getRequest,
  resolve,
} from '$utils/oas/index';
import Appbar from './_parts/_appbar/index';
import Navigation from './_parts/_navigation/index';

type Props = PageProps;
const OAuthRedirectPage: React.FC<Props> = ({ location }) => {
  useTheme();

  const [error, setError] = useState<BaseError | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const queries = parse(location.search);
  const endpointId = get<EndpointID>(KEY.OAUTH_ENDPOINT_ID);
  const [endpoint] = useRecoilState(endpointOneState({ id: endpointId }));
  const [document, setDocument] = useState<Document | null>(null);
  const [request, setRequest] = useState<TypeRequest | null>(null);
  const [defaultValues, setDefaultValues] = useState<RequestValue | null>(null);

  useEffect(function () {
    if (!endpoint) {
      setError(new BaseError('TODO: Endpoint Not Found.'));
      setIsPending(false);
      return;
    }
    if (!endpoint.isPrivate || !endpoint.authConfigs) {
      setError(new BaseError('TODO: Endpoint Not Found.'));
      setIsPending(false);
      return;
    }
    const authConfig = endpoint.authConfigs.list.find(function (authConfig) {
      return authConfig.type === 'oauthcallback';
    });
    if (!authConfig) {
      setError(
        new BaseError('TODO: AuthConfig of type oauthcallback not found.')
      );
      setIsPending(false);
      return;
    }
    const document = resolve(endpoint.authConfigs.oas);
    const getRequestResult = getRequest(document, {
      operationId: authConfig.operationId,
    });
    if (getRequestResult.isFailure()) {
      setError(new BaseError('TODO'));
      setIsPending(false);
      return;
    }
    const request = getRequestResult.value;
    const defaultValues = _.merge(
      {},
      {
        parameters: authConfig.defaultParametersValue,
        requestBody: authConfig.defaultRequestBodyValue,
      },
      cleanupRequestValue(request, {
        parameters: queries,
        requestBody: queries,
      })
    );
    setDocument(document);
    setRequest(request);
    setDefaultValues(defaultValues);
    setIsPending(false);
  }, []);

  const handleSubmit = async function (requestValue: RequestValue) {
    if (!endpoint || !document || !request) {
      return;
    }

    const requestPayloads = constructRequestPayloads(
      request.operation,
      requestValue
    );
    const requestInfo: RequestInfo = constructRequestInfo(
      endpoint,
      document,
      request,
      requestPayloads
    );
    const requestInit: RequestInit = constructRequestInit(
      request,
      requestPayloads
    );
    const [response, responseError] = await promiseErrorHandler(
      fetch(requestInfo, requestInit)
    );
    if (responseError) {
      setError(new NetworkError());
      return;
    }
    if (!response.ok) {
      setError(getHTTPError(response.status as HTTPStatusCode));
      return;
    }
    navigate(`/endpoints/${endpoint.id}`);
  };

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
    function ({ className }) {
      if (isPending) {
        return (
          <div className={classnames('p-2', className)}>TODO: pending...</div>
        );
      }
      if (error) {
        return <Error on={ON.BACKGROUND} error={error} />;
      }
      if (!request || !defaultValues) {
        // TODO: ここにくることはないはず。
        return null;
      }
      if (!endpoint || !document) {
        return null;
      }
      return (
        <div>
          <p>{`https://localhost:8000/oauthredirect`}</p>
          <Request
            on={ON.BACKGROUND}
            endpoint={endpoint}
            document={document}
            request={request}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
          />
        </div>
      );
    },
    [error, isPending, endpoint, document, request, defaultValues, handleSubmit]
  );

  return (
    <>
      <Metadata title="OAuth" />
      <Layout
        renderAppBar={renderAppBar}
        renderNavigation={renderNavigation}
        renderBody={renderBody}
      />
    </>
  );
};
export default OAuthRedirectPage;
