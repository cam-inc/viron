import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import { Helmet } from 'react-helmet-async';

const query = graphql`
  query Metadata {
    site {
      siteMetadata {
        title
        description
        author
        authorURL
        helpURL
        licenseURL
        keywords
        creator
        publisher
      }
    }
  }
`;
type StaticData = {
  site: {
    siteMetadata: {
      title: string;
      description: string;
      author: string;
      authorURL: string;
      helpURL: string;
      licenseURL: string;
      keywords: string[];
      creator: string;
      publisher: string;
    };
  };
};

// TODO: robots.txt/sitemap/GA/GoogleSearchConsole/ogp/構造化データも。

type Props = {
  title?: string;
  description?: string;
  canonicalPathname?: string;
  // @see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name#standard_metadata_names_defined_in_the_html_specification
  // @see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name#other_metadata_names
  // TODO: robots.txtも別途用意すること。
  robots?: (
    | 'index'
    | 'noindex'
    | 'follow'
    | 'nofollow'
    | 'all'
    | 'none'
    | 'noarchive'
    | 'nosnippet'
    | 'noimageindex'
    | 'nocache'
  )[];
  referrer?:
    | 'no-referrer'
    | 'origin'
    | 'no-referrer-when-downgrade'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-URL';
};
const Metadata: React.FC<Props> = ({
  title,
  description,
  canonicalPathname,
  robots,
  referrer,
}) => {
  const staticData = useStaticQuery<StaticData>(query);
  const { siteMetadata } = staticData.site;
  type _Metadata = {
    title: string;
    description: string;
    author: string;
    authorURL: string;
    helpURL: string;
    licenseURL: string;
    keywords: string;
    applicationName: string;
    generator: string;
    themeColor: string;
    colorScheme: string;
    creator: string;
    publisher: string;
    canonicalURL?: string;
    robots?: string;
    referrer?: string;
  };
  const metadata = (function () {
    const ret: Partial<_Metadata> = {};
    // title
    if (title) {
      ret.title = `${title} | ${siteMetadata.title}`;
    } else {
      ret.title = `${siteMetadata.title}`;
    }
    // description
    ret.description = description || siteMetadata.description;
    // author
    ret.author = siteMetadata.author;
    // author url
    ret.authorURL = siteMetadata.authorURL;
    // help url
    ret.helpURL = siteMetadata.helpURL;
    // license url
    ret.licenseURL = siteMetadata.licenseURL;
    // keywords
    ret.keywords = siteMetadata.keywords.join(',');
    // application name
    ret.applicationName = siteMetadata.title;
    // generator
    ret.generator = 'TODO:prdとかdevとかセルフホストじゃないとか';
    // theme color
    // TODO: いい感じに色を変更する。
    ret.themeColor = '#ffffff';
    // color schema
    // TODO: よく調べて値を決める。
    ret.colorScheme = 'light dark';
    // creator
    ret.creator = siteMetadata.creator;
    // publisher
    ret.publisher = siteMetadata.publisher;
    // robots
    if (robots) {
      ret.robots = robots.join(',');
    }
    // referer
    if (referrer) {
      ret.referrer = referrer;
    }
    // canonical
    if (canonicalPathname) {
      ret.canonicalURL = `${new URL(location.href).origin}${canonicalPathname}`;
    }

    return ret as _Metadata;
  })();
  return (
    <Helmet>
      {/* All meta elements line up starting here. */}
      {/* @see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta */}
      {/* @see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset */}
      <meta charSet="UTF-8" />
      {/* @see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name */}
      <meta name="application-name" content={metadata.applicationName} />
      <meta name="author" content={metadata.author} />
      <meta name="description" content={metadata.description} />
      <meta name="generator" content={metadata.generator} />
      <meta name="keywords" content={metadata.keywords} />
      {metadata.referrer && (
        <meta name="referrer" content={metadata.referrer} />
      )}
      <meta name="theme-color" content={metadata.themeColor} />
      <meta name="colorScheme" content={metadata.colorScheme} />
      {/*<meta name="viewport" content="TODO" />*/}
      {/* @see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-http-equiv */}
      {/* TODO: プラグマ指示子がもしあれば */}
      {/* TODO: meta itempropがもしあれば */}
      {/* All non-standard meta elements line up starting here. */}
      {/* @see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name#other_metadata_names */}
      <meta name="creator" content={metadata.creator} />
      <meta name="publisher" content={metadata.publisher} />
      {metadata.robots && <meta name="robots" content={metadata.robots} />}
      {/* @see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title */}
      <title>{metadata.title}</title>
      {/* All link elements line up starting here in order of rel attribute. */}
      {/* @see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link */}
      {/* @see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-rel */}
      <link rel="author" href={metadata.authorURL} />
      {metadata.canonicalURL && (
        <link rel="canonical" href={metadata.canonicalURL} />
      )}
      {/* @see: https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch */}
      {/*<link rel="dns-prefetch" href="TODO: 全てのcross-originドメインを列挙すること" />*/}
      <link rel="help" href={metadata.helpURL} />
      {/* @see: https://caniuse.com/?search=svg%20favicon */}
      {/* Generated by https://realfavicongenerator.net */}
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link rel="icon" href="favicon.svg" type="image/svg+xml" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <link rel="license" href={metadata.licenseURL} />
      {/* @see: https://developer.mozilla.org/en-US/docs/Web/Manifest*/}
      {/*<link rel="manifest" href="TODO.json" />*/}
      {/* @see: https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/modulepreload */}
      {/*<link rel="modulepreload" />*/}
      {/* @see: https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preconnect */}
      {/*<link rel="preconnect" href="TODO: 全てのcross-originドメインを列挙すること" />*/}
      {/* @see: https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/prefetch */}
      {/* @see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ */}
      {/*<link rel="prefetch" href="/images/TODO.png" />*/}
      {/* @see: https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload */}
      {/*<link rel="preload" href="/images/TODO.png" />*/}
      {/* @see: https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/prerender */}
      {/*<link rel="prerender" href="//TODO.com/TODO.html" />*/}
    </Helmet>
  );
};

export default Metadata;
