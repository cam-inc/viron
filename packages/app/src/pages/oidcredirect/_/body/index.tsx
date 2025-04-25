import { parse } from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import Error, { useError } from '~/components/error';
import Request from '~/components/request';
import Spinner from '~/components/spinner';
import { BaseError } from '~/errors';
import { useEndpoint, UseEndpointReturn } from '~/hooks/endpoint';
import { KEY, get } from '~/storage';
import { useEndpointListItemGlobalStateValue } from '~/store';
import { COLOR_SYSTEM, EndpointID } from '~/types';
import { RequestValue } from '~/types/oas';

export type Props = {
  search: string;
};
const Body: React.FC<Props> = ({ search }) => {
  const error = useError({ on: COLOR_SYSTEM.SURFACE, withModal: true });
  const setError = error.setError;
  const [isPending, setIsPending] = useState<boolean>(true);
  const endpoint = useEndpointListItemGlobalStateValue({
    id: get<EndpointID>(KEY.OIDC_ENDPOINT_ID),
  });
  const { prepareSigninOidcCallback, connect, fetchDocument, navigate } =
    useEndpoint();
  const [signinOidcCallback, setSigninOidcCallback] = useState<ReturnType<
    UseEndpointReturn['prepareSigninOidcCallback']
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
      const signinOidcCallback = prepareSigninOidcCallback(
        endpoint,
        authentication,
        {
          parameters: queries,
          requestBody: queries,
        }
      );
      setSigninOidcCallback(signinOidcCallback);
      setIsPending(false);
    };
    f();
  }, [
    endpoint,
    connect,
    fetchDocument,
    setError,
    search,
    prepareSigninOidcCallback,
  ]);

  const handleSubmit = useCallback(
    async (requestValue: RequestValue) => {
      if (!endpoint) {
        return;
      }
      if (!signinOidcCallback) {
        return;
      }
      if (signinOidcCallback.error) {
        return;
      }
      const result = await signinOidcCallback.execute(requestValue);
      if (result.error) {
        error.setError(result.error);
        return;
      }
      navigate(endpoint);
    },
    [endpoint, error, navigate, signinOidcCallback]
  );

  if (isPending) {
    return (
      <div className="p-4 flex justify-center items-center h-full">
        <Spinner className="w-8" on={COLOR_SYSTEM.BACKGROUND} />
      </div>
    );
  }
  if (!signinOidcCallback) {
    return null;
  }
  if (signinOidcCallback.error) {
    return (
      <div className="p-4">
        <Error on={COLOR_SYSTEM.BACKGROUND} error={signinOidcCallback.error} />
      </div>
    );
  }

  return (
    <div>
      <Request
        on={COLOR_SYSTEM.BACKGROUND}
        endpoint={signinOidcCallback.endpoint}
        document={signinOidcCallback.document}
        request={signinOidcCallback.request}
        defaultValues={signinOidcCallback.defaultValues}
        onSubmit={handleSubmit}
      />
      <Error {...error.bind} withModal={true} />
    </div>
  );
};
export default Body;
