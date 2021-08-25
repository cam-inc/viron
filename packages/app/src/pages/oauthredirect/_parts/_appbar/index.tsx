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
      </div>
    </div>
  );
};
export default Appbar;
