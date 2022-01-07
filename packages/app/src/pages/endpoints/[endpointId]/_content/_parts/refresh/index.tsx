import { AiOutlineReload } from '@react-icons/all-files/ai/AiOutlineReload';
import React, { useCallback } from 'react';
import Popover, { usePopover } from '~/portals/popover';
import { UseBaseReturn } from '../../_hooks/useBase';

type Props = {
  base: UseBaseReturn;
};
const Refresh: React.FC<Props> = ({ base }) => {
  const handleButtonClick = function () {
    base.refresh();
  };

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
        ref={popover.targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button onClick={handleButtonClick}>
          <AiOutlineReload />
        </button>
      </div>
      <Popover {...popover.bind}>
        <div className="text-thm-on-surface whitespace-nowrap">Refresh</div>
      </Popover>
    </>
  );
};
export default Refresh;
