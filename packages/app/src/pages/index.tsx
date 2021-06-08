import { Link, PageProps } from 'gatsby';
import React from 'react';

type Props = PageProps;
const IndexPage: React.FC<Props> = () => {
  // TODO
  return (
    <div id="page-index">
      <Link to="/home">home</Link>
    </div>
  );
};

export default IndexPage;
