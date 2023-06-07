import React, { useCallback, useMemo } from 'react';
import Breadcrumb, { Props as BreadcrumbProps } from '~/components/breadcrumb';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import TextOnButton, {
  Props as TextOnButtonProps,
} from '~/components/button/text/on';
import CommonMark from '~/components/commonMark';
import DotsVerticalIcon from '~/components/icon/dotsVertical/outline';
import MenuAlt1Icon from '~/components/icon/menuAlt1/outline';
import ExternalLinkIcon from '~/components/icon/externalLink/outline';
import ServerIcon from '~/components/icon/server/outline';
import TagIcon from '~/components/icon/tag/outline';
import Link from '~/components/link';
import Logo from '~/components/logo';
import { Props as LayoutProps } from '~/layouts';
import Popover, { usePopover } from '~/portals/popover';
import { useAppScreenGlobalStateValue } from '~/store';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, Page, Content } from '~/types/oas';

type Props = Parameters<NonNullable<LayoutProps['renderAppBar']>>[0] & {
  endpoint: Endpoint;
  document: Document;
  page: Page;
};
const Appbar: React.FC<Props> = ({
  className,
  style,
  openNavigation,
  endpoint,
  document,
  page,
}) => {
  const screen = useAppScreenGlobalStateValue();
  const { lg } = screen;

  // Navigation Opener.
  const handleNavButtonClick = useCallback<TextOnButtonProps['onClick']>(() => {
    openNavigation();
  }, [openNavigation]);

  // Endpoint Info.
  const thumbnail = useMemo<JSX.Element>(() => {
    if (!document.info['x-thumbnail']) {
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
          backgroundImage: `url(${document.info['x-thumbnail']})`,
        }}
      />
    );
  }, [endpoint, document]);
  const endpointPopover = usePopover<HTMLDivElement>();
  const handleEndpointClick = useCallback<TextOnButtonProps['onClick']>(() => {
    endpointPopover.open();
  }, [endpointPopover]);

  // Page Info.
  const breadcrumbList = useMemo<BreadcrumbProps['list']>(() => {
    if (!page.group) {
      return [];
    }
    return page.group.split('/');
  }, [page.group]);
  const pagePopover = usePopover<HTMLDivElement>();
  const handlePageClick = useCallback<TextOnButtonProps['onClick']>(() => {
    pagePopover.open();
  }, [pagePopover]);

  // Contents Info
  const contentsPopover = usePopover<HTMLDivElement>();
  const handleContentsClick = useCallback<TextOnButtonProps['onClick']>(() => {
    contentsPopover.open();
  }, [contentsPopover]);
  const handleContentClick = useCallback<TextOnButtonProps<Content>['onClick']>(
    (content) => {
      contentsPopover.close();
      const contentId = content.id;
      const elm = globalThis.document.querySelector(`#${contentId}`);
      if (!elm) {
        return;
      }
      elm.scrollIntoView({
        behavior: 'smooth',
      });
    },
    [contentsPopover]
  );

  return (
    <>
      <div style={style} className={className}>
        <div className="flex gap-2 items-center h-full px-4">
          {!lg && (
            <div className="flex-none">
              <TextOnButton
                on={COLOR_SYSTEM.PRIMARY}
                size={BUTTON_SIZE.XL}
                Icon={MenuAlt1Icon}
                onClick={handleNavButtonClick}
              />
            </div>
          )}
          <div className="flex-none">
            <div ref={endpointPopover.targetRef}>
              <TextOnButton
                on={COLOR_SYSTEM.PRIMARY}
                onClick={handleEndpointClick}
              >
                <div className="flex gap-2 items-center">
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
                </div>
              </TextOnButton>
            </div>
          </div>
          <div className="flex-none">
            <div className="border-r border-thm-on-primary-slight h-4" />
          </div>
          <div className="flex-none">
            <div ref={pagePopover.targetRef}>
              <TextOnButton on={COLOR_SYSTEM.PRIMARY} onClick={handlePageClick}>
                <div className="flex gap-1">
                  {!!breadcrumbList.length && (
                    <Breadcrumb
                      className="text-xxs"
                      on={COLOR_SYSTEM.PRIMARY}
                      list={breadcrumbList}
                    />
                  )}
                  <div className="text-xs text-thm-on-primary">
                    {page.title}
                  </div>
                </div>
              </TextOnButton>
            </div>
          </div>
          <div className="flex-1" />
          <div className="flex-none">
            <div ref={contentsPopover.targetRef}>
              <TextOnButton
                on={COLOR_SYSTEM.PRIMARY}
                Icon={DotsVerticalIcon}
                onClick={handleContentsClick}
              />
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
          </div>
          <div className="flex items-center gap-1">
            <div className="flex-1 flex items-center gap-1 text-xs">
              <ServerIcon className="w-em" />
              <div>{endpoint.url}</div>
            </div>
          </div>
          <div className="flex items-stretch h-2 my-2">
            <div className="flex-1 bg-thm-primary" />
            <div className="flex-1 bg-thm-secondary" />
            <div className="flex-1 bg-thm-on-surface" />
            <div className="flex-1 bg-thm-on-surface-low" />
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
              <Link to={document.externalDocs.url}>
                <div className="flex items-center gap-1 text-xxs text-thm-on-surface-low">
                  <div>External Docs</div>
                  <ExternalLinkIcon className="w-em" />
                </div>
              </Link>
            </div>
          )}
          {document.info.termsOfService && (
            <div className="flex justify-end">
              <Link to={document.info.termsOfService}>
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
              <Link to="https://viron.plus">
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
              <Link to="https://viron.plus">
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
        {page.contents.map((content) => (
          <div key={content.id}>
            <TextOnButton<Content>
              on={COLOR_SYSTEM.SURFACE}
              label={content.title || content.id}
              data={content}
              onClick={handleContentClick}
            />
          </div>
        ))}
      </Popover>
    </>
  );
};
export default Appbar;
