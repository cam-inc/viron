import React, { useCallback } from 'react';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import TextButton from '~/components/button/text/on';
import MenuAlt1Icon from '~/components/icon/menuAlt1/outline';
import { Props as LayoutProps } from '~/layouts';
import { useAppScreenGlobalStateValue } from '~/store';
import { COLOR_SYSTEM } from '~/types';
import Export from './export';
import Import from './import';

type Props = Parameters<NonNullable<LayoutProps['renderAppBar']>>[0];
const Appbar: React.FC<Props> = ({ className, style, openNavigation }) => {
  const screen = useAppScreenGlobalStateValue();
  const { lg } = screen;

  const handleNavButtonClick = useCallback(() => {
    openNavigation();
  }, [openNavigation]);

  return (
    <div className={className} style={style}>
      <div className="flex justify-center items-center h-full px-4">
        <div className="flex-none">
          {!lg && (
            <TextButton
              on={COLOR_SYSTEM.PRIMARY}
              size={BUTTON_SIZE.XL}
              Icon={MenuAlt1Icon}
              onClick={handleNavButtonClick}
            />
          )}
        </div>
        <div className="flex-1 min-w-0" />
        <div className="flex-none">
          <ul className="flex gap-2">
            <li className="">
              <Export />
            </li>
            <li className="">
              <Import />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Appbar;
