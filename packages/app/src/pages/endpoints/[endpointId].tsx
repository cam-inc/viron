import { Link, PageProps } from 'gatsby';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { oneState } from '$store/selectors/endpoint';
import { Token } from '$types/index';
import { Document } from '$types/oas';
import { isOASSupported, promiseErrorHandler } from '$utils/index';

type Props = PageProps;
const EndpointOnePage: React.FC<Props> = ({ params }) => {
  const [endpoint, setEndpoint] = useRecoilState(
    oneState({ id: params.endpointId })
  );
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [document, setDocument] = useState<Document | null>(null);

  // We don't use OAS documents stored in the recoid store on purpose. The reasons are below.
  // - Unsure that the stored document is up-to-date.
  // - The token may be expired.
  useEffect(
    function () {
      const f = async function (): Promise<void> {
        if (!endpoint) {
          return;
        }
        const [response, responseError] = await promiseErrorHandler(
          fetch(endpoint.url, {
            mode: 'cors',
            headers: {
              Authorization: endpoint.token as Token,
            },
          })
        );

        if (!!responseError) {
          // Network error.
          setError(responseError.message);
          setIsPending(false);
          return;
        }
        if (!response.ok) {
          // The token is not valid.
          setError(`${response.status}: ${response.statusText}`);
          setIsPending(false);
          return;
        }

        const document: Document = await response.json();
        if (!isOASSupported(document)) {
          setError('The OAS Document is not of version we support.');
          setIsPending(false);
          return;
        }
        // Just update the stored data so that other pages using endpoints data be affected.
        setEndpoint({ ...endpoint, document });
        setDocument(document);
        setIsPending(false);
      };
      f();
    },
    [endpoint, setEndpoint]
  );

  if (!endpoint) {
    return (
      <div id="page-endpointOne">
        <p>endpoint not found...</p>
        <Link to="/home">HOME</Link>
      </div>
    );
  }

  if (isPending) {
    return (
      <div id="page-endpointOne">
        <p>fetching the OAS document...</p>
      </div>
    );
  }

  if (!!error) {
    return (
      <div id="page-endpointOne">
        <p>error: {error}</p>
        <Link to="/home">HOME</Link>
      </div>
    );
  }

  return (
    <div id="page-endpointOne">
      <div>
        <p>{JSON.stringify(document)}</p>
      </div>
    </div>
  );
};

export default EndpointOnePage;
