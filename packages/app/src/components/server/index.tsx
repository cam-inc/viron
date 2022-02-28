import classnames from 'classnames';
import React, { useCallback } from 'react';
import { Props as BaseProps } from '~/components';
import CommonMark from '~/components/commonMark';
import ServerIcon from '~/components/icon/server/outline';
import Popover, { usePopover } from '~/portals/popover';
import { Server } from '~/types/oas';

type Props = BaseProps & {
  server: Server;
};
const _Server: React.FC<Props> = ({ on, server, className = '' }) => {
  const popover = usePopover<HTMLDivElement>();
  const handleMouseEnter = useCallback(() => {
    popover.open();
  }, [popover]);
  const handleMouseLeave = useCallback(() => {
    popover.close();
  }, [popover]);

  return (
    <>
      <div
        className={classnames(
          'p-1 text-xs rounded border',
          `text-thm-on-${on}-low border-thm-on-${on}-low`,
          className
        )}
        ref={popover.targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center gap-1">
          <ServerIcon className="w-em" />
          <div>{server.url}</div>
        </div>
      </div>
      {server.description && (
        <Popover {...popover.bind}>
          <CommonMark on={on} data={server.description} />
        </Popover>
      )}
    </>
  );
};
export default _Server;
