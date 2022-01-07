import React, { useCallback, useMemo } from 'react';
import Breadcrumb, { Props as BreadcrumbProps } from '~/components/breadcrumb';
import CommonMark from '~/components/commonMark';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import ExternalLinkIcon from '~/components/icon/externalLink/outline';
import ServerIcon from '~/components/icon/server/outline';
import TagIcon from '~/components/icon/tag/outline';
import Link from '~/components/link';
import Logo from '~/components/logo';
import { Props as LayoutProps } from '~/layouts/index';
import Popover, { usePopover } from '~/portals/popover';
import { useAppScreenGlobalStateValue } from '~/store';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, Info } from '~/types/oas';

type Props = {
  endpoint: Endpoint;
  document: Document;
  page: Info['x-pages'][number];
} & Parameters<NonNullable<LayoutProps['renderAppBar']>>[0];
const Header: React.FC<Props> = ({
  className = '',
  openNavigation,
  endpoint,
  document,
  page,
}) => {
  const screen = useAppScreenGlobalStateValue();
  const { lg } = screen;

  // Navigation Opener.
  const handleNavButtonClick = useCallback(
    function () {
      openNavigation();
    },
    [openNavigation]
  );

  // Endpoint Info.
  const thumbnail = useMemo<JSX.Element>(
    function () {
      if (!endpoint?.document || !endpoint.document.info['x-thumbnail']) {
        return (
          <div className="h-full p-2 flex items-center">
            <Logo
              left="text-thm-on-background"
              right="text-thm-on-background-low"
            />
          </div>
        );
      }
      return (
        <div
          className="h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${endpoint.document.info['x-thumbnail']})`,
          }}
        />
      );
    },
    [endpoint]
  );
  const endpointPopover = usePopover<HTMLButtonElement>();
  const handleEndpointClick = useCallback(
    function () {
      endpointPopover.open();
    },
    [endpointPopover]
  );

  // Page Info.
  const breadcrumbList = useMemo<BreadcrumbProps['list']>(
    function () {
      if (!page.group) {
        return [];
      }
      return page.group.split('/');
    },
    [page.group]
  );
  const pagePopover = usePopover<HTMLButtonElement>();
  const handlePageClick = useCallback(
    function () {
      pagePopover.open();
    },
    [pagePopover]
  );

  // Contents Info
  const contentsPopover = usePopover<HTMLDivElement>();
  const handleContentsClick = useCallback(
    function () {
      contentsPopover.open();
    },
    [contentsPopover]
  );
  /*
  const handleContentClick = useCallback<
    (content: Info['x-pages'][number]['contents'][number]) => void
  >(
    function(content) {
      contentsPopover.close();
      const contentId = content.id;
      const elm = window.document.querySelector(`#${contentId}`);
      if (!elm) {
        return;
      }
      elm.scrollIntoView({
        behavior: 'smooth',
      });
    },
    [contentsPopover]
  );
  */
  const handleContentClick = useCallback(() => {
    // TODO: 上記と同じ処理を。
  }, []);

  return (
    <>
      <div className={className}>
        <div className="flex gap-2 items-center h-full px-4">
          {!lg && (
            <div className="flex-none">
              <button className={className} onClick={handleNavButtonClick}>
                sidebar
              </button>
            </div>
          )}
          <div className="flex-none">
            <button
              className="flex gap-2 p-2 items-center text-left rounded hover:bg-thm-on-primary-faint focus:outline-none focus:ring-2 focus:ring-inset focus:ring-thm-on-primary focus:bg-thm-on-primary-faint active:bg-thm-on-primary-faint"
              ref={endpointPopover.targetRef}
              onClick={handleEndpointClick}
            >
              <div className="w-10 h-10 bg-cover bg-thm-background bg-center rounded overflow-hidden border-2 border-thm-on-primary-faint">
                {thumbnail}
              </div>
              <div className="">
                <div className="text-xs font-bold text-thm-on-primary">
                  {endpoint.id}
                </div>
                <div className="text-sm font-bold text-thm-on-primary-high">
                  {document.info.title}
                </div>
              </div>
            </button>
          </div>
          <div className="flex-none">
            <ChevronRightIcon className="text-thm-on-primary-slight w-em" />
          </div>
          <div className="flex-none">
            <button
              className="flex gap-1 p-2 rounded hover:bg-thm-on-primary-faint focus:outline-none focus:ring-2 focus:ring-inset focus:ring-thm-on-primary focus:bg-thm-on-primary-faint active:bg-thm-on-primary-faint"
              ref={pagePopover.targetRef}
              onClick={handlePageClick}
            >
              {!!breadcrumbList.length && (
                <Breadcrumb
                  className="text-xxs"
                  on={COLOR_SYSTEM.PRIMARY}
                  list={breadcrumbList}
                />
              )}
              <div className="text-xs text-thm-on-primary">{page.title}</div>
            </button>
          </div>
          <div className="flex-none">
            <ChevronRightIcon className="text-thm-on-primary-slight w-em" />
          </div>
          <div className="flex-none">
            <div ref={contentsPopover.targetRef}>
              <button className={className} onClick={handleContentsClick}>
                contents
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Endpoint Popover */}
      <Popover {...endpointPopover.bind}>
        <div className="flex flex-col gap-1 text-thm-on-surface">
          <div className="flex items-center gap-2">
            <div className="flex-1 text-base text-thm-on-surface-high font-bold whitespace-nowrap truncate">
              {document.info.title}
            </div>
            <div className="flex-none px-1 rounded border border-thm-on-surface-low text-thm-on-surface-low text-xxs font-bold">
              ver.{document.info.version}
            </div>
            <div className="flex-none px-1 rounded border border-thm-on-surface-low text-thm-on-surface-low text-xxs font-bold">
              {endpoint.isPrivate ? 'Private' : 'Public'}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex-1 flex items-center gap-1 text-xs">
              <ServerIcon className="w-em" />
              <div>{endpoint.url}</div>
            </div>
          </div>
          <div className="flex items-stretch h-2 my-2">
            <div className="flex-1 bg-thm-primary" />
            <div className="flex-1 bg-thm-primary-variant" />
            <div className="flex-1 bg-thm-secondary" />
            <div className="flex-1 bg-thm-secondary-variant" />
          </div>
          {document.info['x-tags'] && (
            <div className="flex items-center gap-2">
              {document.info['x-tags'].map(function (tag) {
                return (
                  <div
                    key={tag}
                    className="flex items-center gap-1 px-1 border rounded text-xxs text-thm-on-surface-low border-thm-on-surface-low"
                  >
                    <TagIcon className="w-em" />
                    <div>{tag}</div>
                  </div>
                );
              })}
            </div>
          )}
          {document.info.description && (
            <CommonMark
              on={COLOR_SYSTEM.SURFACE}
              data={document.info.description}
            />
          )}
          {document.externalDocs && (
            <div className="flex justify-end">
              <Link on={COLOR_SYSTEM.SURFACE} to={document.externalDocs.url}>
                <div className="flex items-center gap-1 text-xxs text-thm-on-surface-low">
                  <div>External Docs</div>
                  <ExternalLinkIcon className="w-em" />
                </div>
              </Link>
            </div>
          )}
          {document.info.termsOfService && (
            <div className="flex justify-end">
              <Link on={COLOR_SYSTEM.SURFACE} to={document.info.termsOfService}>
                <div className="flex items-center gap-1 text-xxs text-thm-on-surface-low">
                  <div>Terms of Service</div>
                  <ExternalLinkIcon className="w-em" />
                </div>
              </Link>
            </div>
          )}
          {document.info.contact && (
            <div className="flex justify-end">
              {/* TODO: Contactコンポーネントを作ること。*/}
              <Link on={COLOR_SYSTEM.SURFACE} to="https://viron.app">
                <div className="flex items-center gap-1 text-xxs text-thm-on-surface-low">
                  <div>{document.info.contact.name || 'Contact'}</div>
                  <ExternalLinkIcon className="w-em" />
                </div>
              </Link>
            </div>
          )}
          {document.info.license && (
            <div className="flex justify-end">
              {/* TODO: Licenseコンポーネントを作ること。*/}
              <Link on={COLOR_SYSTEM.SURFACE} to="https://viron.app">
                <div className="flex items-center gap-1 text-xxs text-thm-on-surface-low">
                  <div>{document.info.license.name}</div>
                  <ExternalLinkIcon className="w-em" />
                </div>
              </Link>
            </div>
          )}
        </div>
      </Popover>
      {/* Page Popover */}
      <Popover {...pagePopover.bind}>
        <div className="flex flex-col gap-1 text-thm-on-surface whitespace-nowrap">
          {page.group && (
            <div className="text-xxs text-thm-on-surface-low">{page.group}</div>
          )}
          <div className="text-xxs">{page.id}</div>
          <div className="text-base text-thm-on-surface-high font-bold">
            {page.title}
          </div>
          {page.description && (
            <CommonMark on={COLOR_SYSTEM.SURFACE} data={page.description} />
          )}
        </div>
      </Popover>
      {/* Contents Popover */}
      <Popover {...contentsPopover.bind}>
        {page.contents.map(function (content) {
          return (
            <React.Fragment key={content.id}>
              {/*
              <Button<Info['x-pages'][number]['contents'][number]>
                on={ON.SURFACE}
                size={BUTTON_SIZE.SM}
                variant={BUTTON_VARIANT.TEXT}
                label={content.title || content.id}
                data={content}
                onClick={handleContentClick}
              />
               */}
              <button onClick={handleContentClick}>
                {content.title || content.id}
              </button>
            </React.Fragment>
          );
        })}
      </Popover>
    </>
  );
};
export default Header;
