import classNames from 'classnames';
import { PageProps } from 'gatsby';
import { graphql } from 'gatsby';
import React, { useCallback } from 'react';
import FilledButton from '~/components/button/filled';
import CheckCircleIcon from '~/components/icon/checkCircle/solid';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ExternalLinkIcon from '~/components/icon/externalLink/outline';
import GithubIcon from '~/components/icon/github/solid';
import LanguageIcon from '~/components/icon/language/outline';
import Link from '~/components/link';
import Logo from '~/components/logo';
import Metadata from '~/components/metadata';
import { URL } from '~/constants';
import { useTranslation, useI18n, Trans } from '~/hooks/i18n';
import useTheme from '~/hooks/theme';
import Layout, { Props as LayoutProps } from '~/layouts';
import Popover, { usePopover } from '~/portals/popover';
import { useAppScreenGlobalStateValue } from '~/store';
import { COLOR_SYSTEM } from '~/types';
import pkg from '../../package.json';

type Props = PageProps;
const HomePage: React.FC<Props> = () => {
  const { t } = useTranslation();
  const { navigate } = useI18n();
  useTheme();
  const screen = useAppScreenGlobalStateValue();
  const { languages, changeLanguage, language: currentLanguage } = useI18n();
  const menuPopover = usePopover<HTMLButtonElement>();

  const handleDashboardButtonClick = useCallback(() => {
    navigate('/dashboard/endpoints');
  }, [navigate]);

  const renderBody = useCallback<LayoutProps['renderBody']>(
    ({ className, style, minHeight }) => {
      const poster = (
        <div className="bg-thm-background text-thm-on-background flex flex-col items-center justify-center">
          <Logo.renewal className="w-24" />
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
        <article className="lg:max-w-[400px] px-10 mx-auto">
          <h1 className="text-lg font-bold mb-4">{t('welcomeMessage')}</h1>
          <p className="mb-6 text-sm leading-relaxed">{t('description')}</p>
          <FilledButton.renewal
            className="w-full"
            cs={COLOR_SYSTEM.PRIMARY}
            label={t('startButtonLabel')}
            onClick={handleDashboardButtonClick}
          />
          <div className="text-xs mt-20 [&>ul]:flex [&>ul]:gap-x-4 [&>ul]:gap-y-2 [&>ul]:flex-wrap space-y-4">
            <ul>
              <NavigationListItem
                icon={<ExternalLinkIcon />}
                label="documentation"
                to={URL.DOCUMENTATION}
              />
              <NavigationListItem
                icon={<ExternalLinkIcon />}
                label="releaseNotes"
                to={URL.RELEASE_NOTES}
              />
              <NavigationListItem
                icon={<ExternalLinkIcon />}
                label="help"
                to={URL.HELP}
              />
            </ul>
            <ul>
              <NavigationListItem
                icon={<GithubIcon />}
                label="service.github"
                to={URL.GITHUB}
              />
            </ul>
            {/* TODO: navigation languagesと共通化 */}
            <button
              ref={menuPopover.targetRef}
              className="py-1 pr-1 flex items-center gap-1 text-thm-on-surface hover:underline active:text-thm-on-surface-low outline-thm-outline rounded-sm"
              onClick={menuPopover.open}
            >
              <div className="p-0.5">
                <LanguageIcon className="w-[1.42em] h-[1.42em]" />
              </div>
              {t(`language.${currentLanguage}`)}
              <ChevronDownIcon className="w-em" />
            </button>
            <Popover.renewal {...menuPopover.bind}>
              <ul className="flex flex-col gap-2 min-w-[108px]">
                {languages.map((language) => (
                  <li key={language}>
                    <button
                      className="h-6 w-full flex items-center px-1 hover:underline focus:outline-none active:text-thm-on-surface-low focus:ring-2 focus:ring-thm-on-surface"
                      onClick={() => changeLanguage(language)}
                    >
                      <CheckCircleIcon
                        className={classNames('w-4 mr-2', {
                          'text-thm-on-surface-faint':
                            language !== currentLanguage,
                        })}
                      />
                      {t(`language.${language}`)}
                    </button>
                  </li>
                ))}
              </ul>
            </Popover.renewal>
          </div>
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
              <div className="pt-19 pb-16 flex items-stretch justify-center ">
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
    [
      changeLanguage,
      currentLanguage,
      handleDashboardButtonClick,
      languages,
      menuPopover.bind,
      menuPopover.open,
      menuPopover.targetRef,
      screen.lg,
      t,
    ]
  );

  return (
    <>
      <Metadata />
      <Layout renderBody={renderBody} />
    </>
  );
};

const NavigationListItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  to: string;
}> = ({ icon, label, to }) => {
  const { t } = useTranslation();
  return (
    <li key={to}>
      <Link
        className="py-1 pr-1 flex gap-1 items-center text-thm-on-surface hover:underline active:text-thm-on-surface-low outline-thm-outline rounded-sm"
        to={to}
      >
        <div className="p-0.5 [&>*]:w-[1.42em] [&>*]:h-[1.42em]">{icon}</div>
        <div>{t(label)}</div>
      </Link>
    </li>
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
