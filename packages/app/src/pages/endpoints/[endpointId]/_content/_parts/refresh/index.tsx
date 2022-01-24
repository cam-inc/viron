import { AiOutlineReload } from '@react-icons/all-files/ai/AiOutlineReload';
import React, { useCallback } from 'react';
import Button from '$components/button';
import Popover, { usePopover } from '$components/popover';
import { ON } from '$constants/index';
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
        <Button
          on={ON.SURFACE}
          variant="text"
          Icon={AiOutlineReload}
          onClick={handleButtonClick}
        />
      </div>
      <Popover {...popover.bind}>
        <div className="text-on-surface whitespace-nowrap">Refresh</div>
      </Popover>
    </>
  );
};
export default Refresh;