import classnames from 'classnames';
import _ from 'lodash';
import { parse } from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import Error from '~/components/error';
import Request from '~/components/request';
import Spinner from '~/components/spinner';
import { BaseError } from '~/errors';
import { useEndpoint, UseEndpointReturn } from '~/hooks/endpoint';
import { Props as LayoutProps } from '~/layouts';
import { KEY, get } from '~/storage';
import { useEndpointListItemGlobalStateValue } from '~/store';
import { COLOR_SYSTEM, EndpointID } from '~/types';
import { RequestValue } from '~/types/oas';

export type Props = Parameters<LayoutProps['renderBody']>[0] & {
  search: string;
};
const Body: React.FC<Props> = ({ className = '', search }) => {
  const [error, setError] = useState<BaseError | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const endpoint = useEndpointListItemGlobalStateValue({
    id: get<EndpointID>(KEY.OAUTH_ENDPOINT_ID),
  });
  const { prepareSigninOAuthCallback, connect, fetchDocument, navigate } =
    useEndpoint();
  const [signinOAuthCallback, setSigninOAuthCallback] = useState<ReturnType<
    UseEndpointReturn['prepareSigninOAuthCallback']
  > | null>(null);

  useEffect(() => {
    setError(null);
    setIsPending(true);
    if (!endpoint) {
      setError(new BaseError('Endpoint Not Found.'));
      setIsPending(false);
      return;
    }
    const f = async () => {
      const connection = await connect(endpoint.url);
      if (connection.error) {
        setError(connection.error);
        setIsPending(false);
        return;
      }
      const fetchDocumentResult = await fetchDocument(endpoint);
      if (fetchDocumentResult.error) {
        setError(fetchDocumentResult.error);
        setIsPending(false);
        return;
      }
      const { authentication } = fetchDocumentResult;
      const queries = parse(search);
      const signinOAuthCallback = prepareSigninOAuthCallback(
        endpoint,
        authentication,
        {
          parameters: queries,
          requestBody: queries,
        }
      );
      setSigninOAuthCallback(signinOAuthCallback);
      setIsPending(false);
    };
    f();
  }, [endpoint, connect, fetchDocument]);

  const handleSubmit = useCallback(
    async (requestValue: RequestValue) => {
      if (!endpoint) {
        return;
      }
      if (!signinOAuthCallback) {
        return;
      }
      if (signinOAuthCallback.error) {
        return;
      }
      const result = await signinOAuthCallback.execute(requestValue);
      if (result.error) {
        setError(result.error);
        return;
      }
      navigate(endpoint);
    },
    [endpoint, navigate, signinOAuthCallback]
  );

  if (isPending) {
    return (
      <div className={classnames('p-4', className)}>
        <Spinner className="w-8" on={COLOR_SYSTEM.BACKGROUND} />
      </div>
    );
  }
  if (error) {
    <div className={classnames('p-4', className)}>
      return <Error on={COLOR_SYSTEM.BACKGROUND} error={error} />;
    </div>;
  }
  if (!signinOAuthCallback) {
    return null;
  }
  if (signinOAuthCallback.error) {
    return (
      <div className={classnames('p-4', className)}>
        <Error on={COLOR_SYSTEM.BACKGROUND} error={signinOAuthCallback.error} />
      </div>
    );
  }

  return (
    <div>
      <Request
        on={COLOR_SYSTEM.BACKGROUND}
        endpoint={signinOAuthCallback.endpoint}
        document={signinOAuthCallback.document}
        request={signinOAuthCallback.request}
        defaultValues={signinOAuthCallback.defaultValues}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
export default Body;
