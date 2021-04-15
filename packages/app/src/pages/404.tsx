import { PageProps } from 'gatsby';
import React from 'react';

type Props = PageProps;
const NotfoundPage: React.FC<Props> = () => {
  return <p>404</p>;
};

export default NotfoundPage;
