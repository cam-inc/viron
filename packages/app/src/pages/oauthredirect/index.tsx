import { navigate, PageProps } from 'gatsby';
import { parse } from 'query-string';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { oneState as endpointOneState } from '$store/selectors/endpoint';
import { EndpointID } from '$types/index';
import { Method } from '$types/oas';
import { promiseErrorHandler } from '$utils/index';

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
  // TODO: hooks/oasを利用したい。
  const pathname = Object.keys(pathObject)[0];
  const pathItem = pathObject[pathname];
  const method = Object.keys(pathItem)[0] as Method;

  useEffect(
    function () {
      const f = async function () {
        const [response, responseError] = await promiseErrorHandler(
          fetch(`${new URL(endpoint.url).origin}${pathname}`, {
            method,
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
    },
    [endpoint, endpointId]
  );

  return <p>Processing OAuth redirection...</p>;
};
export default OAuthRedirectPage;
