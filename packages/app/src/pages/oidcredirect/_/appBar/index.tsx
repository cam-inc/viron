import React, { useCallback } from 'react';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import Button from '~/components/button';
import MenuAlt1Icon from '~/components/icon/menuAlt1/outline';
import { Props as LayoutProps } from '~/layouts';
import { useAppScreenGlobalStateValue } from '~/store';
import { COLOR_SYSTEM } from '~/types';

type Props = Parameters<NonNullable<LayoutProps['renderAppBar']>>[0];
const AppBar: React.FC<Props> = ({ className = '', openNavigation }) => {
  const { lg } = useAppScreenGlobalStateValue();
  const handleNavButtonClick = useCallback(() => {
    openNavigation();
  }, [openNavigation]);

  return (
    <div className={className}>
      <div className="flex justify-center items-center h-full px-4">
        <div className="flex-none">
          {!lg && (
            <Button
              variant="text"
              on={COLOR_SYSTEM.PRIMARY}
              size={BUTTON_SIZE.XL}
              Icon={MenuAlt1Icon}
              onClick={handleNavButtonClick}
            />
          )}
        </div>
        <div className="flex-1 min-w-0" />
      </div>
    </div>
  );
};
export default AppBar;
