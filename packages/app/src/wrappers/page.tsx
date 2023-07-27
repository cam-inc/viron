/**
 * In gatsby-plugin-react-i18next, the redirect function causes a hydration error, so I am describing the modified version here.
 * @see https://github.com/microapps/gatsby-plugin-react-i18next/blob/0cb31fe4e48dd5b1771efaf24c85ece5540aa084/src/plugin/wrapPageElement.tsx
 */
// @ts-ignore
import browserLang from 'browser-lang';
import { PageProps, PluginOptions, withPrefix } from 'gatsby';
import React from 'react';

const LANGUAGE_KEY = 'gatsby-i18next-language';

type I18NextContext = {
  language: string;
  routed: boolean;
  languages: string[];
  defaultLanguage: string;
  generateDefaultLanguagePage: boolean;
  originalPath: string;
  path: string;
  siteUrl?: string;
};

type PageContext = {
  path?: string;
  language: string;
  i18n: I18NextContext;
};

const removePathPrefix = (pathname: string, stripTrailingSlash: boolean) => {
  const pathPrefix = withPrefix('/');
  let result = pathname;

  if (pathname.startsWith(pathPrefix)) {
    result = pathname.replace(pathPrefix, '/');
  }

  if (stripTrailingSlash && result.endsWith('/')) {
    return result.slice(0, -1);
  }

  return result;
};

type Props = {
  pluginOptions: PluginOptions;
} & PageProps<unknown, PageContext>;

const PageWrapper: React.FC<Props> = (
  props,
  { redirect = true, fallbackLanguage, trailingSlash }
) => {
  const { pageContext, location, children } = props;
  const { routed, language, languages, defaultLanguage } = pageContext.i18n;

  const isRedirect = redirect && !routed;

  if (isRedirect) {
    const { search } = location;

    // Skip build, Browsers only
    if (typeof window !== 'undefined') {
      let detected =
        window.localStorage.getItem(LANGUAGE_KEY) ||
        browserLang({
          languages,
          fallback: fallbackLanguage || language,
        });

      if (!languages.includes(detected)) {
        detected = language;
      }

      window.localStorage.setItem(LANGUAGE_KEY, detected);

      if (detected !== defaultLanguage) {
        const queryParams = search || '';
        const stripTrailingSlash = trailingSlash === 'never';
        const newUrl = withPrefix(
          `/${detected}${removePathPrefix(
            location.pathname,
            stripTrailingSlash
          )}${queryParams}${location.hash}`
        );

        // @ts-ignore
        window.___replace(newUrl);

        // The following code causes a hydration error. Inconsistency occurs between the server-rendered children and null because hydration happens while switching the URL.
        // return null;
      }
    }
  }

  return <>{children}</>;
};

export default PageWrapper;
