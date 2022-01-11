import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components/';

export type Props = BaseProps & {
  title: string;
  description?: string;
};
const Head: React.FC<Props> = ({ on, className = '', title, description }) => {
  return (
    <div className={classnames('space-y-4', className)}>
      <div className={`text-thm-on-${on} text-2xl font-bold`}>{title}</div>
      {description && (
        <div className={`text-thm-on-${on}-low text-sm`}>{description}</div>
      )}
    </div>
  );
};
export default Head;
