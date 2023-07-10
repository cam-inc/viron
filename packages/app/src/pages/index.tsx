import { PageProps } from 'gatsby';
import { graphql } from 'gatsby';
import React, { useCallback } from 'react';
import FilledButton from '~/components/button/filled';
import Logo from '~/components/logo';
import Metadata from '~/components/metadata';
import NavigationLanguages from '~/components/navigation/languages';
import NavigationLinks from '~/components/navigation/links';
import NavigationServices from '~/components/navigation/services';
import { useTranslation, useI18n, Trans } from '~/hooks/i18n';
import useTheme from '~/hooks/theme';
import Layout, { Props as LayoutProps } from '~/layouts';
import { useAppScreenGlobalStateValue } from '~/store';
import { COLOR_SYSTEM } from '~/types';
import pkg from '../../package.json';

type Props = PageProps;
const HomePage: React.FC<Props> = () => {
  const { t } = useTranslation();
  const { navigate } = useI18n();
  useTheme();
  const screen = useAppScreenGlobalStateValue();

  const handleDashboardButtonClick = useCallback(() => {
    navigate('/dashboard/endpoints');
  }, [navigate]);

  const renderBody = useCallback<LayoutProps['renderBody']>(
    ({ className, style, minHeight }) => {
      const poster = (
        <div className="bg-thm-background text-thm-on-background flex flex-col items-center justify-center">
          <div className="w-24">
            <Logo
              left="text-thm-on-background-high"
              right="text-thm-on-background"
            />
          </div>
          <div className="text-2xl mt-8 font-bold mb-2 text-thm-on-background-high">
            {t('catchphrase')}
          </div>
          <p className="text-center mt-3 text-xs">
            <Trans t={t} i18nKey="subCatchphrase" components={{ br: <br /> }} />
          </p>
          <div className="text-xxs mt-6 text-thm-on-background-low">
            {t('version', { version: pkg.version })}
          </div>
        </div>
      );
      const direction = (
        <article className="w-72 mx-auto">
          <h1 className="text-lg font-bold mb-4">{t('welcomeMessage')}</h1>
          <p className="mb-6 text-sm leading-relaxed">{t('description')}</p>
          <FilledButton.renewal
            className="mb-21 w-full"
            cs={COLOR_SYSTEM.PRIMARY}
            label={t('startButtonLabel')}
            onClick={handleDashboardButtonClick}
          />
          <NavigationLinks.renewal
            className="flex gap-2"
            on={COLOR_SYSTEM.SURFACE_VARIANT}
          />
          <NavigationServices.renewal
            className="mt-6 flex gap-2"
            on={COLOR_SYSTEM.SURFACE_VARIANT}
          />
          <NavigationLanguages
            className="mt-6 flex gap-2"
            on={COLOR_SYSTEM.SURFACE_VARIANT}
          />
        </article>
      );

      return (
        <div className={className} style={style}>
          {screen.lg ? (
            <div className="absolute inset-0 flex">
              {/* Left Side */}
              <div className="flex-1 flex items-center justify-center">
                {poster}
              </div>
              {/* Right Side */}
              <div className="py-8 bg-thm-surface text-thm-on-surface flex-1 flex items-center justify-center">
                {direction}
              </div>
            </div>
          ) : (
            <div
              style={{
                height: `${minHeight}px`,
              }}
              className="flex flex-col"
            >
              <div className="pt-19 pb-7 flex items-stretch justify-center ">
                {poster}
              </div>
              <div className="py-8 bg-thm-surface text-thm-on-surface grow">
                {direction}
              </div>
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
