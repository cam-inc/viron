import { BiServer } from '@react-icons/all-files/bi/BiServer';
import classnames from 'classnames';
import React, { useCallback } from 'react';
import CommonMark from '$components/commonMark';
import Popover, { usePopover } from '$components/popover';
import { On } from '$constants/index';
import { ClassName } from '$types/index';
import { Server } from '$types/oas';

type Props = {
  on: On;
  server: Server;
  className?: ClassName;
};
const _Server: React.FC<Props> = ({ on, server, className = '' }) => {
  const popover = usePopover<HTMLDivElement>();
  const handleMouseEnter = useCallback(
    function () {
      popover.open();
    },
    [popover]
  );
  const handleMouseLeave = useCallback(
    function () {
      popover.close();
    },
    [popover]
  );

  return (
    <>
      <div
        className={classnames(
          'p-1 text-xs rounded border',
          `text-on-${on}-low border-on-${on}-low`,
          className
        )}
        ref={popover.targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center gap-1">
          <BiServer />
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
