import { BiSidebar } from '@react-icons/all-files/bi/BiSidebar';
import React, { useCallback } from 'react';
import Button, {
  SIZE as BUTTON_SIZE,
  VARIANT as BUTTON_VARIANT,
} from '$components/button';
import { ON } from '$constants/index';
import { Props as LayoutProps } from '$layouts/index';
import { useAppScreenGlobalStateValue } from '$store/index';
import Export from './export/index';
import Import from './import/index';

type Props = Parameters<NonNullable<LayoutProps['renderAppBar']>>[0];
const Appbar: React.FC<Props> = ({ className = '', openNavigation }) => {
  const screen = useAppScreenGlobalStateValue();
  const { lg } = screen;

  const handleNavButtonClick = useCallback(
    function () {
      openNavigation();
    },
    [openNavigation]
  );

  return (
    <div className={className}>
      <div className="flex justify-center items-center h-full px-4">
        <div className="flex-none">
          {!lg && (
            <Button
              variant={BUTTON_VARIANT.TEXT}
              size={BUTTON_SIZE['2XL']}
              on={ON.PRIMARY}
              Icon={BiSidebar}
              className={className}
              onClick={handleNavButtonClick}
            />
          )}
        </div>
        <div className="flex-1 min-w-0" />
        <div className="flex-none">
          <ul className="flex gap-2 text-xs text-thm-on-primary">
            <li className="flex justify-center items-center">
              <Export />
            </li>
            <li className="flex justify-center items-center px-2">
              <Import />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Appbar;