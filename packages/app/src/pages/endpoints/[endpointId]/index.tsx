import { useLocation } from '@reach/router';
import { graphql, PageProps } from 'gatsby';
import _ from 'lodash';
import { parse } from 'query-string';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Error from '~/components/error';
import Metadata from '~/components/metadata';
import { BaseError } from '~/errors/index';
import { useEndpoint } from '~/hooks/endpoint';
import { useI18n } from '~/hooks/i18n';
import useTheme from '~/hooks/theme';
import Layout, { Props as LayoutProps } from '~/layouts/index';
import { useEndpointListItemGlobalStateValue } from '~/store';
import { COLOR_SYSTEM } from '~/types';
import { Document, Info } from '~/types/oas';
import Appbar from './_/appBar';
import Body, { Props as BodyProps } from './_/body';
import Navigation, { Props as NavigationProps } from './_/navigation';
import SubBody from './_/subBody';

const splitter = ',';

type PageId = Info['x-pages'][number]['id'];
type ContentId = Info['x-pages'][number]['contents'][number]['id'];

type Props = PageProps;
const EndpointPage: React.FC<Props> = ({ params }) => {
  const { navigate } = useI18n();
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<BaseError | null>(null);
  const [document, setDocument] = useState<Document | null>(null);
  const endpoint = useEndpointListItemGlobalStateValue({
    id: params.endpointId,
  });
  const { connect, fetchDocument } = useEndpoint();

  useTheme(document);

  useEffect(() => {
    setError(null);
    setIsPending(true);
    setDocument(null);
    if (!endpoint) {
      setError(new BaseError('endpoint not found.'));
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
      const { document } = fetchDocumentResult;
      if (!document) {
        navigate('/dashboard/endpoints');
        return;
      }
      setDocument(document);
      setIsPending(false);
    };
    f();
  }, [endpoint, connect, fetchDocument]);

  const _navigate = useCallback(
    (pageId: PageId, pinnedContentIds: ContentId[]) => {
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
  const selectedPageId = useMemo<PageId | null>(() => {
    if (!document) {
      return null;
    }
    const queries = parse(location.search);
    const selectedPageId = queries.selectedPageId;
    if (typeof selectedPageId === 'string') {
      return selectedPageId;
    }
    return document.info['x-pages'][0].id;
  }, [location.search, document]);

  const pinnedContentIds = useMemo<ContentId[]>(() => {
    const queries = parse(location.search);
    const pinnedContentIds = queries.pinnedContentIds;
    if (typeof pinnedContentIds !== 'string') {
      return [];
    }
    return pinnedContentIds.split(splitter).filter(function (contentId) {
      return !!contentId;
    });
  }, [location.search]);

  const handlePageSelect = useCallback<NavigationProps['onPageSelect']>(
    (pageId) => {
      _navigate(pageId, pinnedContentIds);
    },
    [_navigate, pinnedContentIds]
  );

  const handleContentPin = useCallback<BodyProps['onPin']>(
    (contentId) => {
      if (!selectedPageId) {
        return;
      }
      _navigate(selectedPageId, [...pinnedContentIds, contentId]);
    },
    [selectedPageId, pinnedContentIds, _navigate]
  );

  const handleContentUnpin = useCallback<BodyProps['onUnpin']>(
    (contentId) => {
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
    (args) => {
      if (isPending || !endpoint || !document || error) {
        return null;
      }
      const page = _.find(document.info['x-pages'], function (page) {
        return page.id === selectedPageId;
      });
      if (!page) {
        return null;
      }
      return <Appbar {...args} page={page} />;
    },
    [endpoint, document, isPending, error, selectedPageId]
  );

  const renderNavigation = useCallback<
    NonNullable<LayoutProps['renderNavigation']>
  >(
    (args) => {
      if (isPending || !endpoint || !document || error) {
        return null;
      }
      if (!selectedPageId) {
        return null;
      }
      return (
        <Navigation
          {...args}
          document={document}
          endpoint={endpoint}
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
        // TODO: show spinner.
        return null;
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
    (args) => {
      if (isPending || !endpoint || !document || error) {
        return null;
      }
      const contents: Info['x-pages'][number]['contents'][number][] = [];
      document.info['x-pages'].forEach((page) => {
        page.contents.forEach((_content) => {
          if (pinnedContentIds.includes(_content.id)) {
            contents.push({ ..._content });
          }
        });
      });
      return (
        <SubBody
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

export default EndpointPage;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
