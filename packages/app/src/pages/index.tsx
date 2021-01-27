import { Link, PageProps } from 'gatsby';
import React from 'react';
import Layout from '@layouts';

type Props = {} & PageProps;
const IndexPage: React.FC<Props> = () => {
  return (
    <Layout>
      <div id="page-index">
        <Link to="/sample">sample</Link>
      </div>
    </Layout>
  );
};

export default IndexPage;
