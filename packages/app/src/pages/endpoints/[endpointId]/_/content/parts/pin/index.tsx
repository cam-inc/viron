import { AiFillPushpin } from '@react-icons/all-files/ai/AiFillPushpin';
import { AiOutlinePushpin } from '@react-icons/all-files/ai/AiOutlinePushpin';
import React, { useCallback } from 'react';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import TextOnButton, {
  Props as TextOnButtonProps,
} from '~/components/button/text/on';
import Popover, { usePopover } from '~/portals/popover';
import { COLOR_SYSTEM } from '~/types';

export type Props = {
  isActive: boolean;
  onClick: () => void;
};
const Pin: React.FC<Props> = ({ isActive, onClick }) => {
  const handleButtonClick = useCallback<
    TextOnButtonProps['onClick'] | FilledButtonProps['onClick']
  >(() => {
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
        {isActive ? (
          <FilledButton
            cs={COLOR_SYSTEM.PRIMARY}
            Icon={AiFillPushpin}
            onClick={handleButtonClick}
          />
        ) : (
          <TextOnButton
            on={COLOR_SYSTEM.SURFACE}
            Icon={AiOutlinePushpin}
            onClick={handleButtonClick}
          />
        )}
      </div>
      <Popover {...popover.bind}>
        <div className="text-thm-on-surface">{isActive ? 'Unpin' : 'Pin'}</div>
      </Popover>
    </>
  );
};
export default Pin;
