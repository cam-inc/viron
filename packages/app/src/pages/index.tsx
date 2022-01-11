import { navigate, PageProps } from 'gatsby';
import React, { useCallback } from 'react';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import FilledButton from '~/components/button/filled';
import BookOpenIcon from '~/components/icon/bookOpen/outline';
import ColorSwatchIcon from '~/components/icon/colorSwatch/outline';
import UserGroupIcon from '~/components/icon/userGroup/outline';
import Logo from '~/components/logo';
import Metadata from '~/components/metadata';
import NavigationLinks from '~/components/navigation/links';
import NavigationServices from '~/components/navigation/services';
import { URL } from '~/constants';
import Layout, { Props as LayoutProps } from '~/layouts';
import useTheme from '~/hooks/theme';
import { COLOR_SYSTEM } from '~/types';
import pkg from '../../package.json';

type Props = PageProps;
const HomePage: React.FC<Props> = () => {
  useTheme();

  const handleDashboardButtonClick = useCallback(function () {
    navigate('/dashboard');
  }, []);

  const handleDocumentationButtonClick = useCallback(function () {
    window.open(URL.DOCUMENTATION);
  }, []);

  const handleContributionButtonClick = useCallback(function () {
    window.open(URL.GITHUB);
  }, []);

  const renderBody = useCallback<LayoutProps['renderBody']>(
    ({ className, style }) => {
      return (
        <div className={className} style={style}>
          <div className="absolute inset-0 flex flex-col lg:flex-row">
            <div className="flex-1 p-4 flex items-center justify-center min-w-0 bg-thm-background text-thm-on-background">
              <div className="flex-initial flex flex-col items-center">
                <div className="w-24 mb-4">
                  <Logo left="text-thm-primary" right="text-thm-secondary" />
                </div>
                <div className="text-xl font-bold mb-2 text-thm-on-background-high">
                  Give OAS, Get GUI.
                </div>
                <p className="text-center mb-2">
                  An Open-Source Frontend-NoCode Administration GUI Tool.
                </p>
                <div className="text-xs text-thm-on-background-low">
                  ver. {pkg.version}
                </div>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col gap-2 items-center justify-center min-w-0 bg-thm-surface text-thm-on-surface">
              <div className="mb-2">
                Welcome to Viron{' '}
                <Logo
                  className="inline w-em"
                  left="text-thm-primary"
                  right="text-thm-secondary"
                />{' '}
                !
              </div>
              <div className="mb-8 max-w-75% text-sm leading-10">
                Visit{' '}
                <FilledButton
                  cs={COLOR_SYSTEM.PRIMARY}
                  size={BUTTON_SIZE.SM}
                  label="Dashboard"
                  Icon={ColorSwatchIcon}
                  onClick={handleDashboardButtonClick}
                />{' '}
                to administrate your services. To learn more about Viron{' '}
                <Logo
                  className="inline w-em"
                  left="text-thm-primary"
                  right="text-thm-secondary"
                />
                , read{' '}
                <FilledButton
                  cs={COLOR_SYSTEM.PRIMARY}
                  size={BUTTON_SIZE.SM}
                  label="Documentation"
                  Icon={BookOpenIcon}
                  onClick={handleDocumentationButtonClick}
                />
                . Your{' '}
                <FilledButton
                  cs={COLOR_SYSTEM.PRIMARY}
                  size={BUTTON_SIZE.SM}
                  label="Contribution"
                  Icon={UserGroupIcon}
                  onClick={handleContributionButtonClick}
                />{' '}
                are always welcomed.
              </div>
              <div className="py-2 px-8 mb-2 border-t border-b border-dotted border-thm-on-surface-slight">
                <NavigationLinks on={COLOR_SYSTEM.SURFACE_VARIANT} />
              </div>
              <div>
                <NavigationServices on={COLOR_SYSTEM.SURFACE_VARIANT} />
              </div>
            </div>
          </div>
        </div>
      );
    },
    []
  );

  return (
    <>
      <Metadata />
      <Layout renderBody={renderBody} />
    </>
  );
};

export default HomePage;
