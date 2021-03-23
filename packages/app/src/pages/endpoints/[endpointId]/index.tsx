import { Link, navigate, PageProps } from 'gatsby';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { oneState } from '$store/selectors/endpoint';
import { Token } from '$types/index';
import { Document, Info } from '$types/oas';
import { isOASSupported, promiseErrorHandler } from '$utils/index';
import _Pages from './_pages';

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
  useEffect(function () {
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
  }, []);

  const [selectedPageIds, setSelectedPageIds] = useState<
    Info['x-pages'][number]['id'][]
  >([]);
  const handlePageSelect = function (
    pageId: Info['x-pages'][number]['id'],
    separate: boolean
  ) {
    if (separate) {
      !selectedPageIds.includes(pageId) &&
        setSelectedPageIds([...selectedPageIds, pageId]);
    } else {
      setSelectedPageIds([pageId]);
    }
    navigate(`/endpoints/${params.endpointId}`, {
      state: {
        pageId,
        pageIds: [pageId],
      },
    });
  };

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

  if (!document) {
    return (
      <div id="page-endpointOne">
        <p>error: Document is null.</p>
        <Link to="/home">HOME</Link>
      </div>
    );
  }

  return (
    <div id="page-endpointOne">
      <div>
        <p>{JSON.stringify(document)}</p>
        <_Pages
          pages={document.info['x-pages']}
          selectedPageIds={selectedPageIds}
          onSelect={handlePageSelect}
        />
      </div>
    </div>
  );
};

export default EndpointOnePage;
