import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import { Helmet } from 'react-helmet-async';

const query = graphql`
  query Metadata {
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
const Metadata: React.FC<Props> = ({ title, description }) => {
  const staticData = useStaticQuery<StaticData>(query);
  const { siteMetadata } = staticData.site;
  const metadata = {
    title: title || siteMetadata.title,
    description: description || siteMetadata.description,
  };
  return (
    <Helmet title={metadata.title}>
      <meta name="description" content={metadata.description} />
      {/* TODO: do more.*/}
    </Helmet>
  );
};

export default Metadata;
