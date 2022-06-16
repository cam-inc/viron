import classnames from 'classnames';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '~/components/logo';
import Navigation, { Props as NavigationProps } from '~/components/navigation';
import NavigationLinks from '~/components/navigation/links';
import NavigationServices from '~/components/navigation/services';
import NavigationVersion from '~/components/navigation/version';
import { Props as LayoutProps } from '~/layouts';
import { COLOR_SYSTEM } from '~/types';

type Props = Parameters<NonNullable<LayoutProps['renderNavigation']>>[0];
const _Navigation: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const renderHead = useCallback<NonNullable<NavigationProps['renderHead']>>(
    () => (
      <div className="flex flex-col gap-2 items-center py-8">
        <Logo
          className="h-12 drop-shadow-01dp"
          left="text-thm-on-surface-high"
          right="text-thm-on-surface"
        />
        <div className="text-thm-on-surface text-xs font-bold text-center">
          {t('pages.endpointimport.006')} <br />
          {t('pages.endpointimport.007')}
        </div>
      </div>
    ),
    []
  );

  const renderTail = useCallback<NonNullable<NavigationProps['renderTail']>>(
    () => (
      <div className="p-2">
        <div className="flex justify-center py-2 border-t border-dotted border-thm-on-surface-slight">
          <NavigationLinks on={COLOR_SYSTEM.SURFACE} />
        </div>
        <div className="flex justify-center py-2 border-t border-dotted border-thm-on-surface-slight">
          <NavigationServices on={COLOR_SYSTEM.SURFACE} />
        </div>
        <div className="flex justify-center py-2 border-t border-dotted border-thm-on-surface-slight">
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
      renderTail={renderTail}
    />
  );
};
export default _Navigation;
