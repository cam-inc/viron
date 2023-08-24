import React, { useCallback, useMemo } from 'react';
import Breadcrumb, { Props as BreadcrumbProps } from '~/components/breadcrumb';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import Button, { Props as ButtonProps } from '~/components/button';
import MenuAlt1Icon from '~/components/icon/menuAlt1/outline';
import { Props as LayoutProps } from '~/layouts';
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
  const handleNavButtonClick = useCallback<ButtonProps['onClick']>(() => {
    openNavigation();
  }, [openNavigation]);

  // Page Info.
  const breadcrumbList = useMemo<BreadcrumbProps['list']>(() => {
    if (!page.group) {
      return [];
    }
    return page.group.split('/');
  }, [page.group]);

  return (
    <div style={style} className={className}>
      <div className="flex gap-2 items-center h-full px-10 bg-thm-background">
        {!lg && (
          <div className="flex-none">
            <Button
              variant="text"
              on={COLOR_SYSTEM.PRIMARY}
              size={BUTTON_SIZE.XL}
              Icon={MenuAlt1Icon}
              onClick={handleNavButtonClick}
            />
          </div>
        )}
        <div className="flex-none">
          <div className="flex gap-1 items-center">
            {!!breadcrumbList.length && (
              <Breadcrumb
                className="text-xxs"
                on={COLOR_SYSTEM.BACKGROUND}
                list={breadcrumbList}
              />
            )}
            <div className="text-xxs text-thm-on-background">{page.title}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Appbar;
