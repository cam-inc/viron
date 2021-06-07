import { navigate, PageProps } from 'gatsby';
import { parse } from 'query-string';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { oneState as endpointOneState } from '$store/selectors/endpoint';
import { EndpointID } from '$types/index';
import { Document, Method } from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import {
  constructFakeDocument,
  constructRequestInfo,
  constructRequestInit,
  getRequest,
} from '$utils/oas/index';

type Props = PageProps;
const OAuthRedirectPage: React.FC<Props> = ({ location }) => {
  const queries = parse(location.search);
  const endpointId = queries.endpointId as EndpointID;
  const [endpoint] = useRecoilState(endpointOneState({ id: endpointId }));

  if (!endpoint) {
    throw new Error('Endoint Not Found.');
  }

  const authConfig = endpoint.authConfigs.find(function (authConfig) {
    return authConfig.type === 'oauthcallback';
  });

  if (!authConfig) {
    throw new Error('AuthConfig of type oauthcallback not found.');
  }

  const { pathObject } = authConfig;
  const document: Document = constructFakeDocument({ paths: pathObject });
  const request = getRequest(document);

  if (!request) {
    throw new Error('TODO');
  }

  useEffect(
    function () {
      const f = async function () {
        // TODO: requestPayloadParametersを作成。
        // TODO: requestPayloadRequestBodyを作成。
        const requestInfo: RequestInfo = constructRequestInfo(
          endpoint,
          document,
          request
        );
        const requestInit: RequestInit = constructRequestInit(request);

        const [response, responseError] = await promiseErrorHandler(
          fetch(requestInfo, requestInit)
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
    },
    [endpoint, endpointId]
  );

  return <p>Processing OAuth redirection...</p>;
};
export default OAuthRedirectPage;
