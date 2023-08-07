import classNames from 'classnames';
import React, { useMemo } from 'react';
import Logo from '~/components/logo';
import { Endpoint } from '~/types';
import { Document } from '~/types/oas';

type Props = {
  endpoint: Endpoint;
  document?: Document;
  className?: string;
};
const Thumbnail: React.FC<Props> = ({ document, className }) => {
  const elm = useMemo<JSX.Element>(() => {
    if (!document?.info['x-thumbnail']) {
      return (
        <div className="h-full flex items-center">
          <Logo.renewal className="h-full" />
        </div>
      );
    }
    return (
      <img
        className="block h-full bg-cover bg-center"
        src={document.info['x-thumbnail']}
      />
    );
  }, [document]);

  return (
    <div className={classNames(className, 'rounded overflow-hidden')}>
      {elm}
    </div>
  );
};
export default Thumbnail;
