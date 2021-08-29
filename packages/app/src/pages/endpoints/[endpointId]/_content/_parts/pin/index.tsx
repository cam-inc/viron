import { AiFillPushpin } from '@react-icons/all-files/ai/AiFillPushpin';
import { AiOutlinePushpin } from '@react-icons/all-files/ai/AiOutlinePushpin';
import React, { useCallback } from 'react';
import Button from '$components/button';
import Popover, { usePopover } from '$components/popover';
import { ON } from '$constants/index';

export type Props = {
  isActive: boolean;
  onClick: () => void;
};
const Pin: React.FC<Props> = ({ isActive, onClick }) => {
  const handleButtonClick = useCallback(
    function () {
      onClick();
    },
    [onClick]
  );

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
          Icon={isActive ? AiFillPushpin : AiOutlinePushpin}
          onClick={handleButtonClick}
        />
      </div>
      <Popover {...popover.bind}>
        <div className="text-on-surface whitespace-nowrap">
          {isActive ? 'Unpin' : 'Pin'}
        </div>
      </Popover>
    </>
  );
};
export default Pin;
