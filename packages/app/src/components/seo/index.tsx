import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import { Helmet } from 'react-helmet-async';

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`;
type StaticData = {
  site: {
    siteMetadata: {
      title: string;
      description: string;
    };
  };
};

type Props = {
  title?: string;
  description?: string;
};
const SEO: React.FC<Props> = ({ title, description }) => {
  const staticData = useStaticQuery<StaticData>(query);
  const { siteMetadata } = staticData.site;
  const seo = {
    title: title || siteMetadata.title,
    description: description || siteMetadata.description,
  };
  return (
    <Helmet title={seo.title}>
      <meta name="description" content={seo.description} />
      {/* TODO: do more.*/}
    </Helmet>
  );
};

export default SEO;
