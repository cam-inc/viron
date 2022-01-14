import { AiFillPushpin } from '@react-icons/all-files/ai/AiFillPushpin';
import { AiOutlinePushpin } from '@react-icons/all-files/ai/AiOutlinePushpin';
import React, { useCallback } from 'react';
import Popover, { usePopover } from '~/portals/popover';

export type Props = {
  isActive: boolean;
  onClick: () => void;
};
const Pin: React.FC<Props> = ({ isActive, onClick }) => {
  const handleButtonClick = useCallback(() => {
    onClick();
  }, [onClick]);

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
        ref={popover.targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button onClick={handleButtonClick}>
          {isActive ? <AiFillPushpin /> : <AiOutlinePushpin />}
        </button>
      </div>
      <Popover {...popover.bind}>
        <div className="text-thm-on-surface whitespace-nowrap">
          {isActive ? 'Unpin' : 'Pin'}
        </div>
      </Popover>
    </>
  );
};
export default Pin;
