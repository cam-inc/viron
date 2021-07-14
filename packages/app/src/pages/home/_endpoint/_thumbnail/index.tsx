import classnames from 'classnames';
import React, { useMemo } from 'react';
import Logo from '$components/logo';
import { Endpoint } from '$types/index';

type Props = {
  className?: string;
  endpoint: Endpoint;
};
const Thumbnail: React.FC<Props> = ({ className = '', endpoint }) => {
  const elm = useMemo<JSX.Element>(
    function () {
      if (!endpoint?.document || !endpoint.document.info['x-thumbnail']) {
        return (
          <div className="h-full p-2 flex items-center">
            <Logo left="text-on-background" right="text-on-background-low" />
          </div>
        );
      }
      return (
        <div
          className="h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${endpoint.document.info['x-thumbnail']})`,
          }}
        />
      );
    },
    [endpoint]
  );

  return (
    <div
      className={classnames(
        'w-16 h-16 rounded bg-background border border-on-background-faint overflow-hidden',
        className
      )}
    >
      {elm}
    </div>
  );
};
export default Thumbnail;
