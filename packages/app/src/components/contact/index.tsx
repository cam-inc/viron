import { PhoneIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import { Props as BaseProps } from '@/components';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { URL } from '@/types';
import { Contact } from '@/types/oas';

type Props = BaseProps & {
  data: Contact;
};

const _Contact: React.FC<Props> = ({ className = '', data }) => {
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
    <Button className={className} asChild variant="link">
      <Link to={to}>
        <PhoneIcon className="w-em" />
        {name}
      </Link>
    </Button>
  );
};
export default _Contact;
