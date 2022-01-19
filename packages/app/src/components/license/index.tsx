import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';
import { License } from '~/types/oas';
type Props = BaseProps & {
  data: License;
};

const _License: React.FC<Props> = ({ on, className = '', data }) => {
  // TODO
  return (
    <div className={classnames(`text-thm-on-${on}`, className)}>
      {data.name}
    </div>
  );
};
export default _License;
