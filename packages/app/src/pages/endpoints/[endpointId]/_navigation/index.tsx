import classnames from 'classnames';
import { Link } from 'gatsby';
import React, { useCallback } from 'react';
import Logo from '$components/logo';
import Navigation, { Props as NavigationProps } from '$components/navigation';
import NavigationLinks from '$components/navigation/links';
import NavigationServices from '$components/navigation/services';
import NavigationVersion from '$components/navigation/version';
import { ON } from '$constants/index';
import { Props as LayoutProps } from '$layouts/index';
import Pages, { Props as PagesProps } from '../_pages';

export type Props = {
  pages: PagesProps['pages'];
  selectedPageId: PagesProps['selectedPageId'];
  onPageSelect: PagesProps['onSelect'];
} & Parameters<NonNullable<LayoutProps['renderNavigation']>>[0];
const _Navigation: React.FC<Props> = ({
  pages,
  selectedPageId,
  onPageSelect,
  className,
  closeNavigation,
}) => {
  const renderHead = useCallback<NonNullable<NavigationProps['renderHead']>>(
    function () {
      return (
        <Link
          to="/dashboard"
          className="flex justify-center items-center h-[62px]"
        >
          <Logo
            className="h-8 drop-shadow-01dp"
            left="text-primary"
            right="text-primary-variant"
          />
        </Link>
      );
    },
    []
  );

  const handlePageSelect = useCallback<Props['onPageSelect']>(
    function (...args) {
      closeNavigation();
      onPageSelect(...args);
    },
    [onPageSelect]
  );
  const renderBody = useCallback<NonNullable<NavigationProps['renderBody']>>(
    function () {
      return (
        <div className="text-on-surface border-t border-on-surface-faint">
          <Pages
            pages={pages}
            selectedPageId={selectedPageId}
            onSelect={handlePageSelect}
          />
        </div>
      );
    },
    [pages, selectedPageId, handlePageSelect]
  );

  const renderTail = useCallback<NonNullable<NavigationProps['renderTail']>>(
    function () {
      return (
        <div className="px-2">
          <div className="flex justify-center py-2">
            <NavigationLinks on={ON.SURFACE} />
          </div>
          <div className="flex justify-center py-2 border-t-2 border-on-surface-faint">
            <NavigationServices on={ON.SURFACE} />
          </div>
          <div className="flex justify-center py-2 border-t-2 border-on-surface-faint">
            <NavigationVersion on={ON.SURFACE} />
          </div>
        </div>
      );
    },
    []
  );

  return (
    <Navigation
      on={ON.SURFACE}
      className={classnames(className, 'h-full')}
      renderHead={renderHead}
      renderBody={renderBody}
      renderTail={renderTail}
    />
  );
};
export default _Navigation;
