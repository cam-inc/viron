import { PageProps } from 'gatsby';
import React from 'react';
import useTheme from '$hooks/theme';

type Props = PageProps;
const DebugPage: React.FC<Props> = () => {
  useTheme();
  return <div>hello</div>;
};
export default DebugPage;
