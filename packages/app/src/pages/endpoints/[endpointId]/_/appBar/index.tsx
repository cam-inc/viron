import React, { useCallback, useMemo } from 'react';
import Breadcrumb, { Props as BreadcrumbProps } from '~/components/breadcrumb';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import TextOnButton, {
  Props as TextOnButtonProps,
} from '~/components/button/text/on';
import CommonMark from '~/components/commonMark';
import MenuAlt1Icon from '~/components/icon/menuAlt1/outline';
import { Props as LayoutProps } from '~/layouts';
import Popover, { usePopover } from '~/portals/popover';
import { useAppScreenGlobalStateValue } from '~/store';
import { COLOR_SYSTEM } from '~/types';
import { Page } from '~/types/oas';

type Props = Parameters<NonNullable<LayoutProps['renderAppBar']>>[0] & {
  page: Page;
};
const Appbar: React.FC<Props> = ({
  className,
  style,
  openNavigation,
  page,
}) => {
  const screen = useAppScreenGlobalStateValue();
  const { lg } = screen;

  // Navigation Opener.
  const handleNavButtonClick = useCallback<TextOnButtonProps['onClick']>(() => {
    openNavigation();
  }, [openNavigation]);

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

  return (
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
        <div className="flex-none" ref={pagePopover.targetRef}>
          <TextOnButton on={COLOR_SYSTEM.PRIMARY} onClick={handlePageClick}>
            <div className="flex gap-1">
              {!!breadcrumbList.length && (
                <Breadcrumb
                  className="text-xxs"
                  on={COLOR_SYSTEM.PRIMARY}
                  list={breadcrumbList}
                />
              )}
              <div className="text-xs text-thm-primary">{page.title}</div>
            </div>
          </TextOnButton>
        </div>
        {/* Page Popover */}
        <Popover {...pagePopover.bind}>
          <div className="flex flex-col gap-1 text-thm-on-surface whitespace-nowrap">
            {page.group && (
              <div className="text-xxs text-thm-on-surface-low">
                {page.group}
              </div>
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
      </div>
    </div>
  );
};
export default Appbar;
