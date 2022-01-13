import React, { useMemo } from 'react';
import Logo from '~/components/logo';
import { Endpoint } from '~/types';
import { Document } from '~/types/oas';

type Props = {
  endpoint: Endpoint;
  document?: Document;
};
const Thumbnail: React.FC<Props> = ({ endpoint, document }) => {
  const elm = useMemo<JSX.Element>(() => {
    if (!document?.info['x-thumbnail']) {
      return (
        <div className="h-full p-2 flex items-center">
          <Logo
            left="text-thm-on-background-medium"
            right="text-thm-on-background-low"
          />
        </div>
      );
    }
    return (
      <img
        className="block h-full bg-cover bg-center"
        src={document.info['x-thumbnail']}
      />
    );
  }, [endpoint, document]);

  return (
    <div className="w-12 h-12 rounded bg-thm-background border border-thm-on-background-faint overflow-hidden">
      {elm}
    </div>
  );
};
export default Thumbnail;
