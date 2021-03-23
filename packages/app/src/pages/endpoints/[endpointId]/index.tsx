import { useLocation } from '@reach/router';
import { Link, navigate, PageProps } from 'gatsby';
import { parse } from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { oneState } from '$store/selectors/endpoint';
import { Token } from '$types/index';
import { Document, Info } from '$types/oas';
import { isOASSupported, promiseErrorHandler } from '$utils/index';
import _Pages from './_pages';
import _Panels from './_panels';

type PageId = Info['x-pages'][number]['id'];

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _navigae = useCallback(
    function (pageIds: PageId[]) {
      navigate(
        `/endpoints/${params.endpointId}?selectedPageIds=${pageIds.join(',')}`
      );
    },
    [params.endpointId]
  );
  const location = useLocation();
  const queries = parse(location.search);
  let selectedPageIds: PageId[] = [];
  if (!!queries.selectedPageIds) {
    selectedPageIds = (queries.selectedPageIds as string).split(',');
  }
  const handlePageSelect = function (pageId: PageId, separate: boolean) {
    let newSelectedPageIds: PageId[] = [...selectedPageIds];
    if (separate) {
      !selectedPageIds.includes(pageId) && newSelectedPageIds.push(pageId);
    } else {
      newSelectedPageIds = [pageId];
    }
    _navigae(newSelectedPageIds);
  };
  const handlePageUnselect = function (pageId: PageId) {
    const newSelectedPageIds: PageId[] = selectedPageIds.filter(
      (selectedPageId) => selectedPageId !== pageId
    );
    _navigae(newSelectedPageIds);
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
        <_Panels
          pages={document.info['x-pages'].filter((page) =>
            selectedPageIds.includes(page.id)
          )}
          onUnselect={handlePageUnselect}
        />
      </div>
    </div>
  );
};

export default EndpointOnePage;
