import classnames from 'classnames';
import React, { useCallback } from 'react';
import Logo from '$components/logo';
import Navigation, { Props as NavigationProps } from '$components/navigation';
import NavigationCopyright from '$components/navigation/copyright';
import NavigationLinks from '$components/navigation/links';
import NavigationServices from '$components/navigation/services';
import { Props as LayoutProps } from '$layouts/index';

type Props = {
  className?: string;
} & Parameters<LayoutProps['renderNavigation']>[0];
const _Navigation: React.FC<Props> = ({ className = '' }) => {
  const renderHead = useCallback<NonNullable<NavigationProps['renderHead']>>(
    function () {
      return (
        <div className="flex justify-center py-8">
          <Logo
            className="h-12 drop-shadow-01dp"
            left="text-primary"
            right="text-primary-variant"
          />
        </div>
      );
    },
    []
  );

  const renderTail = useCallback<NonNullable<NavigationProps['renderTail']>>(
    function () {
      return (
        <div className="p-2">
          <div className="flex justify-center py-2 border-t border-dotted border-on-surface-low">
            <NavigationLinks className="text-on-surface" />
          </div>
          <div className="flex justify-center py-2 border-t border-dotted border-on-surface-low">
            <NavigationServices className="text-on-surface" />
          </div>
          <div className="flex justify-center py-2 border-t border-dotted border-on-surface-low">
            <NavigationCopyright className="text-on-surface" />
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
      renderTail={renderTail}
    />
  );
};
export default _Navigation;
