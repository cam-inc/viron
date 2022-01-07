import classnames from 'classnames';
import React, { useMemo } from 'react';
import Logo from '~/components/logo';
import { ClassName, Endpoint } from '~/types';

type Props = {
  className?: ClassName;
  endpoint: Endpoint;
};
const Thumbnail: React.FC<Props> = ({ className = '', endpoint }) => {
  const elm = useMemo<JSX.Element>(
    function () {
      if (!endpoint?.document || !endpoint.document.info['x-thumbnail']) {
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
        'w-12 h-12 rounded bg-thm-background border border-thm-on-background-faint overflow-hidden',
        className
      )}
    >
      {elm}
    </div>
  );
};
export default Thumbnail;
