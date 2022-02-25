import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components/';

export type Props = BaseProps & {
  title: string | JSX.Element;
  description?: string | JSX.Element;
};
const Head: React.FC<Props> = ({ on, className = '', title, description }) => {
  return (
    <div className={classnames('', className)}>
      <div className={`text-thm-on-${on} text-2xl font-bold`}>{title}</div>
      {description && (
        <div className={`text-thm-on-${on}-low text-sm mt-2`}>
          {description}
        </div>
      )}
    </div>
  );
};
export default Head;
