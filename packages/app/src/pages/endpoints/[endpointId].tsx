import { Link, PageProps } from 'gatsby';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import semverGte from 'semver/functions/gte';
import semverLte from 'semver/functions/lte';
import semverValid from 'semver/functions/valid';
import { oneState as endpointOneState } from '$store/selectors/endpoint';
import { Token } from '$types/index';
import { Document } from '$types/oas';
import { promiseErrorHandler } from '$utils/index';

type Props = PageProps;
const EndpointOnePage: React.FC<Props> = ({ params }) => {
  const endpoint = useRecoilValue(endpointOneState({ id: params.endpointId }));
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
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
        if (
          !(
            semverValid(document.openapi) &&
            semverGte(document.openapi, '3.0.0') &&
            semverLte(document.openapi, '3.0.2')
          )
        ) {
          setError('The OAS Document is not of version we support.');
          setIsPending(false);
          return;
        }

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
