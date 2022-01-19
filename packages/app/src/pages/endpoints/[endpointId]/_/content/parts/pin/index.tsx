import { AiFillPushpin } from '@react-icons/all-files/ai/AiFillPushpin';
import { AiOutlinePushpin } from '@react-icons/all-files/ai/AiOutlinePushpin';
import React, { useCallback } from 'react';
import TextButton, { Props as TextButtonProps } from '~/components/button/text';
import Popover, { usePopover } from '~/portals/popover';
import { COLOR_SYSTEM } from '~/types';

export type Props = {
  isActive: boolean;
  onClick: () => void;
};
const Pin: React.FC<Props> = ({ isActive, onClick }) => {
  const handleButtonClick = useCallback<TextButtonProps['onClick']>(() => {
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
        <TextButton
          cs={COLOR_SYSTEM.PRIMARY}
          Icon={isActive ? AiFillPushpin : AiOutlinePushpin}
          onClick={handleButtonClick}
        />
      </div>
      <Popover {...popover.bind}>
        <div className="text-thm-on-surface">{isActive ? 'Unpin' : 'Pin'}</div>
      </Popover>
    </>
  );
};
export default Pin;
