import classnames from 'classnames';
import React, { useCallback } from 'react';
import Logo from '~/components/logo';
import Navigation, { Props as NavigationProps } from '~/components/navigation';
import NavigationLinks from '~/components/navigation/links';
import NavigationServices from '~/components/navigation/services';
import NavigationVersion from '~/components/navigation/version';
import { Props as LayoutProps } from '~/layouts';
import { ClassName, COLOR_SYSTEM } from '~/types';

type Props = {
  className?: ClassName;
} & Parameters<NonNullable<LayoutProps['renderNavigation']>>[0];
const _Navigation: React.FC<Props> = ({ className, style }) => {
  const renderHead = useCallback<NonNullable<NavigationProps['renderHead']>>(
    function () {
      return (
        <div className="flex flex-col gap-2 items-center py-8">
          <Logo
            className="h-12 drop-shadow-01dp"
            left="text-thm-on-surface-high"
            right="text-thm-on-surface"
          />
          <div className="text-thm-on-surface text-xs font-bold text-center">
            Give OAS, <br />
            Get GUI.
          </div>
        </div>
      );
    },
    []
  );

  const renderTail = useCallback<NonNullable<NavigationProps['renderTail']>>(
    function () {
      return (
        <div className="p-2">
          <div className="flex justify-center py-2 border-t border-dotted border-thm-on-surface-low">
            <NavigationLinks on={COLOR_SYSTEM.SURFACE} />
          </div>
          <div className="flex justify-center py-2 border-t border-dotted border-thm-on-surface-low">
            <NavigationServices on={COLOR_SYSTEM.SURFACE} />
          </div>
          <div className="flex justify-center py-2 border-t border-dotted border-thm-on-surface-low">
            <NavigationVersion on={COLOR_SYSTEM.SURFACE} />
          </div>
        </div>
      );
    },
    []
  );

  return (
    <nav className={classnames(className, 'h-full')} style={style}>
      <Navigation
        on={COLOR_SYSTEM.SURFACE}
        className="h-full"
        renderHead={renderHead}
        renderTail={renderTail}
      />
    </nav>
  );
};
export default _Navigation;
