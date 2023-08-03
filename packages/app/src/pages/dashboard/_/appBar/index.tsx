import React, { useCallback } from 'react';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import TextButton from '~/components/button/text/on';
import MenuAlt1Icon from '~/components/icon/menuAlt1/outline';
import { Props as LayoutProps } from '~/layouts';
import { COLOR_SYSTEM } from '~/types';

type Props = Parameters<NonNullable<LayoutProps['renderAppBar']>>[0];
const Appbar: React.FC<Props> = ({ className, style, openNavigation }) => {
  const handleNavButtonClick = useCallback(() => {
    openNavigation();
  }, [openNavigation]);

  return (
    <div className={className} style={style}>
      <div className="flex items-center h-full px-4">
        <TextButton
          on={COLOR_SYSTEM.PRIMARY}
          size={BUTTON_SIZE.XL}
          Icon={MenuAlt1Icon}
          onClick={handleNavButtonClick}
        />
      </div>
    </div>
  );
};
export default Appbar;
