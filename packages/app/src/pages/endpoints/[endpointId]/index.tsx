import { useLocation } from '@reach/router';
import { Link, navigate, PageProps } from 'gatsby';
import _ from 'lodash';
import { parse } from 'query-string';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import Metadata from '$components/metadata';
import useTheme from '$hooks/theme';
import Layout, { Props as LayoutProps } from '$layouts/index';
import { oneState } from '$store/selectors/endpoint';
import { Document, Info } from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import { lint, resolve } from '$utils/oas';
import Appbar from './_appbar/index';
import Body, { Props as BodyProps } from './_body';
import { Props as ContentProps } from './_content';
import Navigation, { Props as NavigationProps } from './_navigation';
import Subbody from './_subbody';

const splitter = ',';

type PageId = Info['x-pages'][number]['id'];

type Props = PageProps;
const EndpointOnePage: React.FC<Props> = ({ params }) => {
  const [endpoint, setEndpoint] = useRecoilState(
    oneState({ id: params.endpointId })
  );
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [document, setDocument] = useState<Document | null>(null);

  useTheme(document);

  // We don't use OAS documents stored in the recoil store on purpose. The reasons are below.
  // - Unsure that the stored document is up-to-date.
  useEffect(function () {
    const f = async function (): Promise<void> {
      if (!endpoint) {
        return;
      }
      const [response, responseError] = await promiseErrorHandler(
        fetch(endpoint.url, {
          mode: 'cors',
          credentials: 'include',
        })
      );

      if (!!responseError) {
        // Network error.
        setError(responseError.message);
        setIsPending(false);
        return;
      }

      if (!response.ok) {
        // The authorization cookie is not valid.
        setError(`${response.status}: ${response.statusText}`);
        setIsPending(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const document: Record<string, any> = await response.json();
      const { isValid, errors } = lint(document);
      if (!isValid) {
        setError(
          `The OAS Document is not of version we support. ${errors?.[0]?.message}`
        );
        setIsPending(false);
        return;
      }
      const _document = resolve(document);
      // Just update the stored data so that other pages using endpoints data be affected.
      setEndpoint({ ...endpoint, document: _document });
      setDocument(_document);
      setIsPending(false);
    };
    f();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _navigate = useCallback(
    function (pageId: PageId, pinnedContentIds: ContentProps['contentId'][]) {
      pinnedContentIds = _.uniq(pinnedContentIds);
      navigate(
        `/endpoints/${
          params.endpointId
        }?selectedPageId=${pageId}&pinnedContentIds=${pinnedContentIds.join(
          splitter
        )}`
      );
    },
    [params.endpointId]
  );

  const location = useLocation();
  const selectedPageId = useMemo<string | null>(
    function () {
      if (!document) {
        return null;
      }
      const queries = parse(location.search);
      const selectedPageId = queries.selectedPageId;
      if (typeof selectedPageId === 'string') {
        return selectedPageId;
      }
      return document.info['x-pages'][0].id;
    },
    [location.search, document]
  );

  const pinnedContentIds = useMemo<ContentProps['contentId'][]>(
    function () {
      const queries = parse(location.search);
      const pinnedContentIds = queries.pinnedContentIds;
      if (typeof pinnedContentIds !== 'string') {
        return [];
      }
      return pinnedContentIds.split(splitter).filter(function (contentId) {
        return !!contentId;
      });
    },
    [location.search]
  );

  const handlePageSelect = useCallback<NavigationProps['onPageSelect']>(
    function (pageId) {
      _navigate(pageId, pinnedContentIds);
    },
    [_navigate, pinnedContentIds]
  );

  const handleContentPin = useCallback<BodyProps['onPin']>(
    function (contentId) {
      if (!selectedPageId) {
        return;
      }
      _navigate(selectedPageId, [...pinnedContentIds, contentId]);
    },
    [selectedPageId, pinnedContentIds, _navigate]
  );

  const handleContentUnpin = useCallback<BodyProps['onUnpin']>(
    function (contentId) {
      if (!selectedPageId) {
        return;
      }
      _navigate(
        selectedPageId,
        pinnedContentIds.filter(function (_contentId) {
          return _contentId !== contentId;
        })
      );
    },
    [selectedPageId, pinnedContentIds, _navigate]
  );

  const renderAppBar = useCallback<LayoutProps['renderAppBar']>(
    function (args) {
      if (!endpoint || !document) {
        return null;
      }
      return <Appbar {...args} endpoint={endpoint} document={document} />;
    },
    [endpoint, document]
  );

  const renderNavigation = useCallback<LayoutProps['renderNavigation']>(
    function (args) {
      if (!document) {
        return null;
      }
      if (!selectedPageId) {
        return null;
      }
      return (
        <Navigation
          {...args}
          pages={document.info['x-pages']}
          selectedPageId={selectedPageId}
          onPageSelect={handlePageSelect}
        />
      );
    },
    [document, selectedPageId, handlePageSelect]
  );

  const renderBody = useCallback<LayoutProps['renderBody']>(
    function (args) {
      if (!endpoint || !document) {
        return null;
      }
      const page = _.find(document.info['x-pages'], function (page) {
        return page.id === selectedPageId;
      });
      if (!page) {
        return null;
      }
      return (
        <Body
          {...args}
          endpoint={endpoint}
          document={document}
          page={page}
          onPin={handleContentPin}
          onUnpin={handleContentUnpin}
          pinnedContentIds={pinnedContentIds}
        />
      );
    },
    [
      endpoint,
      document,
      selectedPageId,
      handleContentPin,
      handleContentUnpin,
      pinnedContentIds,
    ]
  );

  const renderSubBody = useCallback<NonNullable<LayoutProps['renderSubBody']>>(
    function (args) {
      if (!endpoint || !document) {
        return null;
      }
      const contents = pinnedContentIds.map(function (contentId) {
        const [pageId, idx] = contentId.split('/');
        const page = _.find(document.info['x-pages'], function (page) {
          return page.id === pageId;
        }) as Info['x-pages'][number];
        const content = page.contents[Number(idx)];
        return {
          ...content,
          id: contentId,
        };
      });
      return (
        <Subbody
          {...args}
          endpoint={endpoint}
          document={document}
          contents={contents}
          onPin={handleContentPin}
          onUnpin={handleContentUnpin}
        />
      );
    },
    [endpoint, document, handleContentPin, handleContentUnpin, pinnedContentIds]
  );

  const { t } = useTranslation();

  if (!endpoint) {
    return (
      <div id="page-endpointOne">
        <p>{t('endpoint not found...')}</p>
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
    <>
      <Metadata title="TODO | Viron" />
      <Layout
        renderAppBar={renderAppBar}
        renderNavigation={renderNavigation}
        renderBody={renderBody}
        renderSubBody={pinnedContentIds.length ? renderSubBody : undefined}
      />
    </>
  );
};

export default EndpointOnePage;
