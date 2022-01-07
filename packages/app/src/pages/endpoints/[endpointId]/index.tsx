import { useLocation } from '@reach/router';
import { navigate, PageProps } from 'gatsby';
import _ from 'lodash';
import { parse } from 'query-string';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Error from '~/components/error';
import Metadata from '~/components/metadata';
import { HTTPStatusCode } from '~/constants';
import {
  BaseError,
  getHTTPError,
  NetworkError,
  OASError,
} from '~/errors/index';
import useTheme from '~/hooks/theme';
import Layout, { Props as LayoutProps } from '~/layouts/index';
import { useEndpointListItemGlobalState } from '~/store';
import { COLOR_SYSTEM } from '~/types';
import { Document, Info } from '~/types/oas';
import { promiseErrorHandler } from '~/utils';
import { lint, resolve } from '~/utils/oas';
import Appbar from './_appbar/index';
import Body, { Props as BodyProps } from './_body';
import Navigation, { Props as NavigationProps } from './_navigation';
import Subbody from './_subbody';

const splitter = ',';

type PageId = Info['x-pages'][number]['id'];

type Props = PageProps;
const EndpointOnePage: React.FC<Props> = ({ params }) => {
  const [endpoint, setEndpoint] = useEndpointListItemGlobalState({
    id: params.endpointId,
  });
  const [document, setDocument] = useState<Document | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<BaseError | null>(null);

  useTheme(document);

  // We don't use OAS documents stored in the recoil store on purpose. The reasons are below.
  // - Unsure that the stored document is up-to-date.
  useEffect(function () {
    const f = async function (): Promise<void> {
      if (!endpoint) {
        setError(new BaseError('endpoint not found.'));
        setIsPending(false);
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
        setError(new NetworkError(responseError.message));
        setIsPending(false);
        return;
      }

      if (!response.ok) {
        // The authorization cookie is not valid.
        const error = getHTTPError(response.status as HTTPStatusCode);
        setError(error);
        setIsPending(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const document: Record<string, any> = await response.json();
      const { isValid, errors } = lint(document);
      if (!isValid) {
        setError(new OASError(errors?.[0]?.message));
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
    function (
      pageId: PageId,
      pinnedContentIds: Info['x-pages'][number]['contents'][number]['id'][]
    ) {
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

  const pinnedContentIds = useMemo<
    Info['x-pages'][number]['contents'][number]['id'][]
  >(
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

  const renderAppBar = useCallback<NonNullable<LayoutProps['renderAppBar']>>(
    function (args) {
      if (isPending || !endpoint || !document || error) {
        return null;
      }
      const page = _.find(document.info['x-pages'], function (page) {
        return page.id === selectedPageId;
      });
      if (!page) {
        return null;
      }
      return (
        <Appbar {...args} endpoint={endpoint} document={document} page={page} />
      );
    },
    [endpoint, document, isPending, error, selectedPageId]
  );

  const renderNavigation = useCallback<
    NonNullable<LayoutProps['renderNavigation']>
  >(
    function (args) {
      if (isPending || !endpoint || !document || error) {
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
    [endpoint, document, isPending, error, selectedPageId, handlePageSelect]
  );

  const renderBody = useCallback<LayoutProps['renderBody']>(
    function (args) {
      if (!endpoint || !document) {
        return null;
      }
      if (isPending) {
        return <div>TODO: pending...</div>;
      }
      if (error) {
        return <Error on={COLOR_SYSTEM.BACKGROUND} error={error} />;
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
      isPending,
      error,
      selectedPageId,
      handleContentPin,
      handleContentUnpin,
      pinnedContentIds,
    ]
  );

  const renderSubBody = useCallback<NonNullable<LayoutProps['renderSubBody']>>(
    function (args) {
      if (isPending || !endpoint || !document || error) {
        return null;
      }
      const contents: Info['x-pages'][number]['contents'][number][] = [];
      document.info['x-pages'].forEach(function (page) {
        page.contents.forEach(function (_content) {
          if (pinnedContentIds.includes(_content.id)) {
            contents.push({ ..._content });
          }
        });
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
    [
      endpoint,
      document,
      isPending,
      error,
      handleContentPin,
      handleContentUnpin,
      pinnedContentIds,
    ]
  );

  return (
    <>
      <Metadata />
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
