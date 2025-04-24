import classnames from 'classnames';
import { PhoneIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import { Props as BaseProps } from '~/components';
import Link from '~/components/link';
import { URL } from '~/types';
import { Contact } from '~/types/oas';

type Props = BaseProps & {
  data: Contact;
};

const _Contact: React.FC<Props> = ({ on, className = '', data }) => {
  const name = data.name || 'contact';
  const to = useMemo<URL>(() => {
    if (data.email) {
      return `mailto:${data.email}`;
    }
    if (data.url) {
      return data.url;
    }
    return '';
  }, [data]);

  return (
    <Link className={classnames('group focus:outline-none', className)} to={to}>
      <div
        className={`flex gap-1 items-center text-xs text-thm-on-${on} group-hover:underline group-active:text-thm-on-${on}-low group-focus:ring-2 group-focus:ring-thm-on-${on}`}
      >
        <PhoneIcon className="w-em" />
        <div>{name}</div>
      </div>
    </Link>
  );
};
export default _Contact;
