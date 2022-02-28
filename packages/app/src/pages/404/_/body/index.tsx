import React from 'react';
import SadIcon from '~/components/icon/sad/outline';
import { Props as LayoutProps } from '~/layouts';

export type Props = Parameters<LayoutProps['renderBody']>[0];
const Body: React.FC<Props> = ({ style, className = '' }) => {
  return (
    <div className={className} style={style}>
      <div className="p-4 text-thm-on-background">
        <div>
          Page Not Found...
          <SadIcon className="inline w-em" />
        </div>
      </div>
    </div>
  );
};
export default Body;
