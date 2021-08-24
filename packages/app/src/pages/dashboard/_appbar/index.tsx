import { BiSidebar } from '@react-icons/all-files/bi/BiSidebar';
import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import Button, {
  SIZE as BUTTON_SIZE,
  VARIANT as BUTTON_VARIANT,
} from '$components/button';
import { ON } from '$constants/index';
import { Props as LayoutProps } from '$layouts/index';
import { screenState } from '$store/atoms/app';
import Export from '../_export';
import Import from '../_import';

type Props = Parameters<NonNullable<LayoutProps['renderAppBar']>>[0];
const Appbar: React.FC<Props> = ({ className = '', openNavigation }) => {
  const [screen] = useRecoilState(screenState);
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
              variant={BUTTON_VARIANT.PAPER}
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
          <ul className="flex text-xs text-on-primary">
            <li className="flex justify-center items-center mr-2 last:mr-0">
              <Export />
            </li>
            <li className="flex justify-center items-center px-2 mr-2 last:mr-0">
              <Import />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Appbar;
