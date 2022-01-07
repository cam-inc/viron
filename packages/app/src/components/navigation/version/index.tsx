import React from 'react';
import { Props as BaseProps } from '~/components';
import pkg from '../../../../package.json';

type Props = BaseProps;
const Version: React.FC<Props> = ({ on }) => {
  return (
    <div className={`text-xxs text-thm-on-${on}-low`}>ver. {pkg.version}</div>
  );
};
export default Version;
