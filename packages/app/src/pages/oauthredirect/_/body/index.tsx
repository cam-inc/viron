import { Loader2Icon } from 'lucide-react';
import { parse } from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import Error, { useError } from '@/components/error';
import Request from '@/components/request';
import { BaseError } from '@/errors';
import { useEndpoint, UseEndpointReturn } from '@/hooks/endpoint';
import { KEY, get } from '@/storage';
import { useEndpointListItemGlobalStateValue } from '@/store';
import { EndpointID } from '@/types';
import { RequestValue } from '@/types/oas';

export type Props = {
  search: string;
};
const Body: React.FC<Props> = ({ search }) => {
  const error = useError({ withModal: true });
  const setError = error.setError;
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
  }, [
    endpoint,
    connect,
    fetchDocument,
    setError,
    search,
    prepareSigninOAuthCallback,
  ]);

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
        error.setError(result.error);
        return;
      }
      navigate(endpoint);
    },
    [endpoint, error, navigate, signinOAuthCallback]
  );

  if (isPending) {
    return (
      <div className="p-4 flex justify-center items-center h-full">
        <Loader2Icon className="size-8 animate-spin" />
      </div>
    );
  }
  if (!signinOAuthCallback) {
    return null;
  }
  if (signinOAuthCallback.error) {
    return (
      <div className="p-4">
        <Error error={signinOAuthCallback.error} />
      </div>
    );
  }

  return (
    <div>
      <Request
        endpoint={signinOAuthCallback.endpoint}
        document={signinOAuthCallback.document}
        request={signinOAuthCallback.request}
        defaultValues={signinOAuthCallback.defaultValues}
        onSubmit={handleSubmit}
      />
      <Error {...error.bind} withModal={true} />
    </div>
  );
};
export default Body;
