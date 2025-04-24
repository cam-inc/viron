import { useLocation } from '@reach/router';
import { graphql, PageProps } from 'gatsby';
import _ from 'lodash';
import { ArrowLeftIcon } from 'lucide-react';
import { parse } from 'query-string';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CommonMark from '~/components/commonMark';
import Link from '~/components/link';
import Logo from '~/components/logo';
import Metadata from '~/components/metadata';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable';
import { Separator } from '~/components/ui/separator';
import {
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  Sidebar,
} from '~/components/ui/sidebar';
import { BaseError } from '~/errors/index';
import { useEndpoint } from '~/hooks/endpoint';
import { useI18n } from '~/hooks/i18n';
import useTheme from '~/hooks/theme';
import Pages from '~/pages/endpoints/[endpointId]/_/navigation/pages';
import { useEndpointListItemGlobalStateValue } from '~/store';
import { COLOR_SYSTEM } from '~/types';
import { Document, Info } from '~/types/oas';
import Content from './_/content';
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

  const handlePageSelect = useCallback(
    (pageId: string) => {
      _navigate(pageId, pinnedContentIds);
    },
    [_navigate, pinnedContentIds]
  );

  const handleContentPin = useCallback(
    (contentId: string) => {
      if (!selectedPageId) {
        return;
      }
      _navigate(selectedPageId, [...pinnedContentIds, contentId]);
    },
    [selectedPageId, pinnedContentIds, _navigate]
  );

  const handleContentUnpin = useCallback(
    (contentId: string) => {
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

  const RenderSubBody = useMemo(() => {
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
        endpoint={endpoint}
        document={document}
        contents={contents}
        onPin={handleContentPin}
        onUnpin={handleContentUnpin}
      />
    );
  }, [
    endpoint,
    document,
    isPending,
    error,
    handleContentPin,
    handleContentUnpin,
    pinnedContentIds,
  ]);

  const pages = document?.info['x-pages'] || [];
  const page = _.find(pages, function (page) {
    return page.id === selectedPageId;
  });

  return (
    <>
      <Metadata />
      <SidebarProvider>
        <Sidebar variant="sidebar">
          <SidebarHeader>
            <Link
              className="group focus:outline-none"
              to="/dashboard/endpoints"
            >
              <article className="flex justify-start items-center py-3 px-3 gap-2 group-focus:ring-4 ring-thm-on-surface-low hover:bg-thm-on-surface-faint rounded">
                <ArrowLeftIcon className="w-4 h-4 flex-none" />
                <div className="flex-none w-6 h-6 flex justify-center">
                  {document?.info['x-thumbnail'] ? (
                    <img
                      className="object-contain rounded"
                      src={document.info['x-thumbnail']}
                    />
                  ) : (
                    <Logo
                      className="w-6 h-6"
                      left="text-thm-on-background"
                      right="text-thm-on-background-low"
                    />
                  )}
                </div>
                <div className="flex-1 w-0">
                  <h1 className="text-xxs font-bold text-thm-on-surface-low truncate">
                    {endpoint?.id}
                  </h1>
                  <h2 className="text-xxs text-thm-on-surface-low truncate">
                    {document?.info.title}
                  </h2>
                </div>
              </article>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            {selectedPageId && (
              <Pages
                pages={pages}
                selectedPageId={selectedPageId}
                onSelect={handlePageSelect}
              />
            )}
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="overflow-hidden">
          <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
              />
              <h1 className="text-base font-medium">{page?.title}</h1>
            </div>
          </header>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel>
              {page && endpoint && document && (
                <div className="mx-10 py-6 h-full overflow-y-scroll">
                  {page.description ? (
                    <CommonMark
                      on={COLOR_SYSTEM.BACKGROUND}
                      data={page.description}
                    />
                  ) : undefined}
                  <div
                    className="mt-10"
                    style={{
                      display: 'grid',
                      gap: '8px',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(360px, 1fr))',
                      gridAutoRows: 'auto',
                    }}
                  >
                    {page.contents.map((content) => {
                      const style: React.CSSProperties = {};
                      if (content.type === 'table') {
                        style['gridColumn'] = '1/-1';
                      }
                      return (
                        <div key={content.id} style={style}>
                          <Content
                            endpoint={endpoint}
                            document={document}
                            content={content}
                            isPinned={pinnedContentIds.includes(content.id)}
                            onPin={handleContentPin}
                            onUnpin={handleContentUnpin}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </ResizablePanel>
            {0 < pinnedContentIds.length && RenderSubBody && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel>{RenderSubBody}</ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </SidebarInset>
      </SidebarProvider>
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
