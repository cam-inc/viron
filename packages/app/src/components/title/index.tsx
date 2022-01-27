import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';

export type Props = BaseProps & {
  label: string;
};
const Title: React.FC<Props> = ({ on, className = '', label }) => {
  return (
    <div
      className={classnames(`text-2xl font-bold text-thm-on-${on}`, className)}
    >
      <h1>{label}</h1>
    </div>
  );
};
export default Title;
