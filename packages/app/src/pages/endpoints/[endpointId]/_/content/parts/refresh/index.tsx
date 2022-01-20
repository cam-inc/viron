import React, { useCallback } from 'react';
import TextOnButton, {
  Props as TextOnButtonProps,
} from '~/components/button/text/on';
import RefreshIcon from '~/components/icon/refresh/outline';
import Popover, { usePopover } from '~/portals/popover';
import { COLOR_SYSTEM } from '~/types';
import { UseBaseReturn } from '../../hooks/useBase';

export type Props = {
  base: UseBaseReturn;
};
const Refresh: React.FC<Props> = ({ base }) => {
  const handleButtonClick = useCallback<TextOnButtonProps['onClick']>(() => {
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
        <TextOnButton
          on={COLOR_SYSTEM.SURFACE}
          Icon={RefreshIcon}
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
