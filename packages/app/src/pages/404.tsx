import { PageProps } from 'gatsby';
import React from 'react';
import useTheme from '$hooks/theme';

type Props = PageProps;
const NotfoundPage: React.FC<Props> = () => {
  useTheme();
  // TODO
  return <p>404</p>;
};

export default NotfoundPage;
