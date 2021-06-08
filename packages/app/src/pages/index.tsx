import { Link, PageProps } from 'gatsby';
import React from 'react';
import useTheme from '$hooks/theme';

type Props = PageProps;
const IndexPage: React.FC<Props> = () => {
  useTheme();
  // TODO
  return (
    <div id="page-index">
      <Link to="/home">home</Link>
    </div>
  );
};

export default IndexPage;
