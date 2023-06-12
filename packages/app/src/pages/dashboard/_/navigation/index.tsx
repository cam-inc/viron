import classnames from 'classnames';
import React, { useCallback } from 'react';
import Logo from '~/components/logo';
import Navigation, { Props as NavigationProps } from '~/components/navigation';
import NavigationInternalPages from '~/components/navigation/internalPages';
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
        <div className="flex items-center p-4 gap-2">
          <Logo
            className="h-4 drop-shadow-01dp"
            left="text-thm-on-surface-high"
            right="text-thm-on-surface"
          />
          <div className="text-thm-on-surface text-lg font-bold">viron</div>
        </div>
      );
    },
    []
  );

  const renderBody = useCallback<NonNullable<NavigationProps['renderBody']>>(
    function () {
      return (
        <NavigationInternalPages
          className="mx-2 space-y-1"
          on={COLOR_SYSTEM.BACKGROUND}
        />
      );
    },
    []
  );

  const renderTail = useCallback<NonNullable<NavigationProps['renderTail']>>(
    function () {
      return (
        <div className="my-4 ml-3">
          <div className="mb-6 space-y-4">
            <NavigationLinks.renewal
              className="space-y-4"
              on={COLOR_SYSTEM.SURFACE}
            />
            <NavigationServices.renewal
              className="space-y-4"
              on={COLOR_SYSTEM.SURFACE}
            />
          </div>
          <NavigationVersion on={COLOR_SYSTEM.SURFACE} />
        </div>
      );
    },
    []
  );

  return (
    <nav className={classnames(className, 'h-full')} style={style}>
      <Navigation.renewal
        on={COLOR_SYSTEM.SURFACE}
        className="h-full"
        renderHead={renderHead}
        renderBody={renderBody}
        renderTail={renderTail}
      />
    </nav>
  );
};
export default _Navigation;
