import { GraduationCapIcon } from 'lucide-react';
import React from 'react';
import { Props as BaseProps } from '@/components';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { License } from '@/types/oas';

type Props = BaseProps & {
  data: License;
};

const _License: React.FC<Props> = ({ className = '', data }) => {
  if (data.url) {
    return (
      <Button className={className} asChild variant="link">
        <Link to={data.url}>
          <GraduationCapIcon className="w-em" />
          {data.name}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      className={cn('pointer-events-none', className)}
      asChild
      variant="link"
    >
      <div>
        <GraduationCapIcon className="w-em" />
        <div>{data.name}</div>
      </div>
    </Button>
  );
};
export default _License;
