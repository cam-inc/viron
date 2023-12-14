import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import Logo from '~/components/logo';
import { Endpoint } from '~/types';
import { Document } from '~/types/oas';

type Props = {
  endpoint: Endpoint;
  document?: Document;
  className?: string;
};
const Thumbnail: React.FC<Props> = ({ document, className }) => {
  const [thumbnail, setThumbnail] = useState(document?.info['x-thumbnail']);
  const elm = useMemo<JSX.Element>(() => {
    if (!thumbnail) {
      return (
        <div className="h-full flex items-center">
          <Logo
            left="text-thm-on-background"
            right="text-thm-on-background-low"
          />
        </div>
      );
    }
    return (
      <img
        className="block h-full bg-cover bg-center"
        src={thumbnail}
        alt=""
        onError={() => {
          setThumbnail(undefined);
        }}
      />
    );
  }, [thumbnail]);

  return (
    <div className={classNames(className, 'rounded overflow-hidden')}>
      {elm}
    </div>
  );
};
export default Thumbnail;
