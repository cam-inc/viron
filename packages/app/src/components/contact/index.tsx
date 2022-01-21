import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';
import { Contact } from '~/types/oas';
type Props = BaseProps & {
  data: Contact;
};

const _Contact: React.FC<Props> = ({ on, className = '', data }) => {
  return (
    <div className={classnames(`text-thm-on-${on}`, className)}>
      TODO:contact
    </div>
  );
};
export default _Contact;
