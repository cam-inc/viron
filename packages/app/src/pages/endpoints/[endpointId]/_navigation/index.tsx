import classnames from 'classnames';
import { Link } from 'gatsby';
import React, { useCallback } from 'react';
import Logo from '$components/logo';
import Navigation, { Props as NavigationProps } from '$components/navigation';
import NavigationCopyright from '$components/navigation/copyright';
import NavigationLinks from '$components/navigation/links';
import NavigationServices from '$components/navigation/services';
import { ON } from '$constants/index';
import { Props as LayoutProps } from '$layouts/index';
import Pages, { Props as PagesProps } from '../_pages';

export type Props = {
  pages: PagesProps['pages'];
  selectedPageId: PagesProps['selectedPageId'];
  onPageSelect: PagesProps['onSelect'];
} & Parameters<LayoutProps['renderNavigation']>[0];
const _Navigation: React.FC<Props> = ({
  pages,
  selectedPageId,
  onPageSelect,
  className,
}) => {
  const renderHead = useCallback<NonNullable<NavigationProps['renderHead']>>(
    function () {
      return (
        <Link to="/home" className="flex justify-center items-center h-[62px]">
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

  const renderBody = useCallback<NonNullable<NavigationProps['renderBody']>>(
    function () {
      return (
        <div className="text-on-surface border-t border-on-surface-faint">
          <Pages
            pages={pages}
            selectedPageId={selectedPageId}
            onSelect={onPageSelect}
          />
        </div>
      );
    },
    [pages, selectedPageId, onPageSelect]
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
            <NavigationCopyright on={ON.SURFACE} />
          </div>
        </div>
      );
    },
    []
  );

  return (
    <Navigation
      className={classnames(className, 'h-full')}
      renderHead={renderHead}
      renderBody={renderBody}
      renderTail={renderTail}
    />
  );
};
export default _Navigation;
