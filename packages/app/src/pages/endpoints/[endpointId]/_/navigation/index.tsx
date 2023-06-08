import classnames from 'classnames';
import { Link } from 'gatsby';
import React, { useCallback } from 'react';
import Logo from '~/components/logo';
import Navigation, { Props as NavigationProps } from '~/components/navigation';
import NavigationLinks from '~/components/navigation/links';
import NavigationServices from '~/components/navigation/services';
import NavigationVersion from '~/components/navigation/version';
import { Props as LayoutProps } from '~/layouts';
import { COLOR_SYSTEM } from '~/types';
import Pages, { Props as PagesProps } from './pages';

export type Props = Parameters<
  NonNullable<LayoutProps['renderNavigation']>
>[0] & {
  pages: PagesProps['pages'];
  selectedPageId: PagesProps['selectedPageId'];
  onPageSelect: PagesProps['onSelect'];
};
const _Navigation: React.FC<Props> = ({
  pages,
  selectedPageId,
  onPageSelect,
  className,
  closeNavigation,
}) => {
  const handlePageSelect = useCallback<Props['onPageSelect']>(
    (...args) => {
      closeNavigation();
      onPageSelect(...args);
    },
    [onPageSelect]
  );

  const renderHead = useCallback<NonNullable<NavigationProps['renderHead']>>(
    () => (
      <Link
        to="/dashboard/endpoints"
        className="flex justify-center items-center h-[62px]"
      >
        <Logo
          className="h-8 drop-shadow-01dp"
          left="text-thm-on-surface-high"
          right="text-thm-on-surface"
        />
      </Link>
    ),
    []
  );

  const renderBody = useCallback<NonNullable<NavigationProps['renderBody']>>(
    () => (
      <div className="text-thm-on-surface border-t border-thm-on-surface-faint">
        <Pages
          pages={pages}
          selectedPageId={selectedPageId}
          onSelect={handlePageSelect}
        />
      </div>
    ),
    [pages, selectedPageId, handlePageSelect]
  );

  const renderTail = useCallback<NonNullable<NavigationProps['renderTail']>>(
    () => (
      <div className="px-2">
        <div className="flex justify-center py-2">
          <NavigationLinks on={COLOR_SYSTEM.SURFACE} />
        </div>
        <div className="flex justify-center py-2 border-t-2 border-thm-on-surface-faint">
          <NavigationServices on={COLOR_SYSTEM.SURFACE} />
        </div>
        <div className="flex justify-center py-2 border-t-2 border-thm-on-surface-faint">
          <NavigationVersion on={COLOR_SYSTEM.SURFACE} />
        </div>
      </div>
    ),
    []
  );

  return (
    <Navigation
      on={COLOR_SYSTEM.SURFACE}
      className={classnames(className, 'h-full')}
      renderHead={renderHead}
      renderBody={renderBody}
      renderTail={renderTail}
    />
  );
};
export default _Navigation;
