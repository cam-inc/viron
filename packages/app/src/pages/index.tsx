import { Link, PageProps } from 'gatsby';
import React from 'react';
import SEO from '$components/seo';
import useTheme from '$hooks/theme';

type Props = PageProps;
const IndexPage: React.FC<Props> = () => {
  useTheme();
  // TODO
  return (
    <>
      <SEO />
      <div id="page-index">
        <Link to="/home">home</Link>
      </div>
    </>
  );
};

export default IndexPage;
