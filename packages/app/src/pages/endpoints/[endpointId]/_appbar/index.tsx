import { BiCaretRight } from '@react-icons/all-files/bi/BiCaretRight';
import { BiListUl } from '@react-icons/all-files/bi/BiListUl';
import { BiSidebar } from '@react-icons/all-files/bi/BiSidebar';
import React, { useCallback, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import Breadcrumb, { Props as BreadcrumbProps } from '$components/breadcrumb';
import Button, {
  SIZE as BUTTON_SIZE,
  VARIANT as BUTTON_VARIANT,
} from '$components/button';
import Logo from '$components/logo';
import Popover, { usePopover } from '$components/popover';
import { ON } from '$constants/index';
import { Props as LayoutProps } from '$layouts/index';
import { screenState } from '$store/atoms/app';
import { Endpoint } from '$types/index';
import { Document, Info } from '$types/oas';

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
  const [screen] = useRecoilState(screenState);
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
            <Logo left="text-on-background" right="text-on-background-low" />
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
  const handleContentClick = useCallback<
    (content: Info['x-pages'][number]['contents'][number]) => void
  >(
    function (content) {
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

  return (
    <>
      <div className={className}>
        <div className="flex gap-2 items-center h-full px-4">
          {!lg && (
            <div className="flex-none">
              <Button
                variant={BUTTON_VARIANT.PAPER}
                size={BUTTON_SIZE['2XL']}
                on={ON.PRIMARY}
                Icon={BiSidebar}
                className={className}
                onClick={handleNavButtonClick}
              />
            </div>
          )}
          <div className="flex-none">
            <button
              className="flex gap-2 p-2 items-center text-left rounded hover:bg-on-primary-faint focus:outline-none focus:ring-2 focus:ring-inset focus:ring-on-primary focus:bg-on-primary-faint active:bg-on-primary-faint"
              ref={endpointPopover.targetRef}
              onClick={handleEndpointClick}
            >
              <div className="w-10 h-10 bg-cover bg-background bg-center rounded overflow-hidden border border-on-primary-slight">
                {thumbnail}
              </div>
              <div className="">
                <div className="text-xs font-bold text-on-primary">
                  {endpoint.id}
                </div>
                <div className="text-sm font-bold text-on-primary-high">
                  {document.info.title}
                </div>
              </div>
            </button>
          </div>
          <div className="flex-none">
            <BiCaretRight className="text-on-primary-low" />
          </div>
          <div className="flex-none">
            <button
              className="flex gap-1 p-2 rounded hover:bg-on-primary-faint focus:outline-none focus:ring-2 focus:ring-inset focus:ring-on-primary focus:bg-on-primary-faint active:bg-on-primary-faint"
              ref={pagePopover.targetRef}
              onClick={handlePageClick}
            >
              {!!breadcrumbList.length && (
                <Breadcrumb
                  className="text-xs"
                  on={ON.PRIMARY}
                  list={breadcrumbList}
                />
              )}
              <div className="text-xs">{page.title}</div>
            </button>
          </div>
          <div className="flex-none">
            <BiCaretRight className="text-on-primary-low" />
          </div>
          <div className="flex-none">
            <div ref={contentsPopover.targetRef}>
              <Button
                variant={BUTTON_VARIANT.TEXT}
                size={BUTTON_SIZE.SM}
                on={ON.PRIMARY}
                Icon={BiListUl}
                label="Contents"
                className={className}
                onClick={handleContentsClick}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Endpoint Popover */}
      <Popover {...endpointPopover.bind}>TODO</Popover>
      {/* Page Popover */}
      <Popover {...pagePopover.bind}>TODO</Popover>
      {/* Contents Popover */}
      <Popover {...contentsPopover.bind}>
        {page.contents.map(function (content) {
          return (
            <React.Fragment key={content.id}>
              <Button<Info['x-pages'][number]['contents'][number]>
                on={ON.SURFACE}
                size={BUTTON_SIZE.SM}
                variant={BUTTON_VARIANT.TEXT}
                label={content.title}
                data={content}
                onClick={handleContentClick}
              />
            </React.Fragment>
          );
        })}
      </Popover>
    </>
  );
};
export default Header;
