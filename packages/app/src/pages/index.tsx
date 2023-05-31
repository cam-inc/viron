import { PageProps } from 'gatsby';
import { graphql } from 'gatsby';
import React, { useCallback } from 'react';
import FilledButton from '~/components/button/filled';
import Logo from '~/components/logo';
import Metadata from '~/components/metadata';
import NavigationLinks from '~/components/navigation/links';
import NavigationServices from '~/components/navigation/services';
import { useTranslation } from '~/hooks/i18n';
import { useNavigation } from '~/hooks/navigation';
import useTheme from '~/hooks/theme';
import Layout, { Props as LayoutProps } from '~/layouts';
import { useAppScreenGlobalStateValue } from '~/store';
import { COLOR_SYSTEM } from '~/types';
import pkg from '../../package.json';

type Props = PageProps;
const HomePage: React.FC<Props> = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  useTheme();
  const screen = useAppScreenGlobalStateValue();

  const handleDashboardButtonClick = useCallback(() => {
    navigate('/dashboard/endpoints');
  }, [navigate]);

  const renderBody = useCallback<LayoutProps['renderBody']>(
    ({ className, style, minHeight }) => {
      const poster = (
        <div className="p-4 bg-thm-background text-thm-on-background flex flex-col items-center justify-center">
          <div className="w-24 mb-4">
            <Logo
              left="text-thm-on-background-high"
              right="text-thm-on-background"
            />
          </div>
          <div className="text-xl font-bold mb-2 text-thm-on-background-high">
            {t('catchphrase')}
          </div>
          <p className="text-center mb-2">{t('subCatchphrase')}</p>
          <div className="text-xs text-thm-on-background-low">
            {t('version', { version: pkg.version })}
          </div>
        </div>
      );
      const direction = (
        <div className="p-4 bg-thm-surface text-thm-on-surface flex flex-col gap-2 items-center justify-center">
          <div className="mb-2">{t('welcomeMessage')}</div>
          <div className="mb-6 max-w-75% text-sm leading-10">
            {t('description')}
          </div>
          <FilledButton
            className="mb-8"
            cs={COLOR_SYSTEM.PRIMARY}
            label={t('startButtonLabel')}
            onClick={handleDashboardButtonClick}
          />
          <div className="py-2 px-8 mb-2 border-t border-b border-dotted border-thm-on-surface-slight">
            <NavigationLinks on={COLOR_SYSTEM.SURFACE_VARIANT} />
          </div>
          <div>
            <NavigationServices on={COLOR_SYSTEM.SURFACE_VARIANT} />
          </div>
        </div>
      );

      return (
        <div className={className} style={style}>
          {screen.lg ? (
            <div className="absolute inset-0 flex items-stretch justify-center">
              {/* Left Side */}
              <div className="flex-1 flex items-stretch justify-center">
                {poster}
              </div>
              {/* Right Side */}
              <div className="flex-1 flex items-stretch justify-center">
                {direction}
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  height: `${minHeight}px`,
                }}
                className="flex items-stretch justify-center"
              >
                {poster}
              </div>
              <div>{direction}</div>
            </div>
          )}
        </div>
      );
    },
    [handleDashboardButtonClick, screen.lg, t]
  );

  return (
    <>
      <Metadata />
      <Layout renderBody={renderBody} />
    </>
  );
};

export default HomePage;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
