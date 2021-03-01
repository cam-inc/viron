import { PageProps } from 'gatsby';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { oneState as endpointOneState } from '$store/selectors/endpoint';
import { Token } from '$types/index';
import { Document } from '$types/oas';
import { promiseErrorHandler } from '$utils/index';

type Props = PageProps;
const EndpointOnePage: React.FC<Props> = ({ params }) => {
  const endpoint = useRecoilValue(endpointOneState({ id: params.endpointId }));
  const [isPending, setIsPending] = useState<boolean>(false);
  const [document, setDocument] = useState<Document | null>(null);

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
          // TODO: show error.
          return;
        }
        if (!response.ok) {
          // Network error.
          // TODO: show error.
          return;
        }

        const document: Document = await response.json();
        setDocument(document);
        setIsPending(false);
      };
      f();
    },
    [endpoint]
  );

  if (!endpoint) {
    return (
      <div id="page-endpointOne">
        <p>not found...</p>
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

  return (
    <div id="page-endpointOne">
      <div>
        <p>{endpoint.id}</p>
        <p>{endpoint.url}</p>
        <p>{JSON.stringify(document)}</p>
      </div>
    </div>
  );
};

export default EndpointOnePage;
