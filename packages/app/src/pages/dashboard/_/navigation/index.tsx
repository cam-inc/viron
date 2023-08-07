import classnames from 'classnames';
import React, { useCallback } from 'react';
import Link from '~/components/link';
import Logo from '~/components/logo';
import Navigation, { Props as NavigationProps } from '~/components/navigation';
import NavigationInternalPages from '~/components/navigation/internalPages';
import NavigationLanguages from '~/components/navigation/languages';
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
        <Link to="/" className="flex items-center m-1 p-1.5 px-5 gap-3">
          <Logo.renewal className="w-6 h-6" />
          <div className="text-thm-on-surface-low text-2xl font-bold">
            viron
          </div>
        </Link>
      );
    },
    []
  );

  const renderBody = useCallback<NonNullable<NavigationProps['renderBody']>>(
    function () {
      return (
        <NavigationInternalPages
          className="px-2 py-6 space-y-1"
          on={COLOR_SYSTEM.SURFACE}
        />
      );
    },
    []
  );

  const renderTail = useCallback<NonNullable<NavigationProps['renderTail']>>(
    function () {
      return (
        <div className="my-4 mx-3">
          <div className="mb-6 space-y-4">
            <NavigationLinks.renewal
              className="space-y-4"
              on={COLOR_SYSTEM.SURFACE}
            />
            <NavigationServices.renewal
              className="space-y-4"
              on={COLOR_SYSTEM.SURFACE}
            />
            <NavigationLanguages on={COLOR_SYSTEM.SURFACE_VARIANT} />
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
