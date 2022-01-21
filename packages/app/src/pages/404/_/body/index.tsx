import React from 'react';
import { Props as LayoutProps } from '~/layouts';

export type Props = Parameters<LayoutProps['renderBody']>[0];
const Body: React.FC<Props> = ({ className = '' }) => {
  return (
    <div className={className}>
      <div className="p-2">TODO: Not Found</div>
    </div>
  );
};
export default Body;
