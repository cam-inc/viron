import { AiOutlineReload } from '@react-icons/all-files/ai/AiOutlineReload';
import React, { useCallback } from 'react';
import TextButton, { Props as TextButtonProps } from '~/components/button/text';
import Popover, { usePopover } from '~/portals/popover';
import { COLOR_SYSTEM } from '~/types';
import { UseBaseReturn } from '../../hooks/useBase';

export type Props = {
  base: UseBaseReturn;
};
const Refresh: React.FC<Props> = ({ base }) => {
  const handleButtonClick = useCallback<TextButtonProps['onClick']>(() => {
    base.refresh();
  }, [base]);

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
          Icon={AiOutlineReload}
          onClick={handleButtonClick}
        />
      </div>
      <Popover {...popover.bind}>
        <div className="text-thm-on-surface">Refresh</div>
      </Popover>
    </>
  );
};
export default Refresh;
