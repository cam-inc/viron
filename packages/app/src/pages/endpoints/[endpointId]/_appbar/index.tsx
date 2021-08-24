import { BiSidebar } from '@react-icons/all-files/bi/BiSidebar';
import React, { useCallback, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import Button, {
  SIZE as BUTTON_SIZE,
  VARIANT as BUTTON_VARIANT,
} from '$components/button';
import Logo from '$components/logo';
import { ON } from '$constants/index';
import { Props as LayoutProps } from '$layouts/index';
import { screenState } from '$store/atoms/app';
import { Endpoint } from '$types/index';
import { Document } from '$types/oas';

type Props = {
  endpoint: Endpoint;
  document: Document;
} & Parameters<NonNullable<LayoutProps['renderAppBar']>>[0];
const Header: React.FC<Props> = ({
  className = '',
  openNavigation,
  endpoint,
  document,
}) => {
  const [screen] = useRecoilState(screenState);
  const { lg } = screen;

  const handleNavButtonClick = useCallback(
    function () {
      openNavigation();
    },
    [openNavigation]
  );

  const thumbnail = useMemo<JSX.Element>(
    function () {
      if (!endpoint?.document || !endpoint.document.info['x-thumbnail']) {
        return (
          <div className="h-full p-2 flex items-center">
            <Logo left="text-on-background" right="text-on-background-low" />
          </div>
        );
      }
      return (
        <div
          className="h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${endpoint.document.info['x-thumbnail']})`,
          }}
        />
      );
    },
    [endpoint]
  );

  return (
    <div className={className}>
      <div className="flex gap-2 items-center h-full px-4">
        {!lg && (
          <div className="flex-none">
            <Button
              variant={BUTTON_VARIANT.PAPER}
              size={BUTTON_SIZE['2XL']}
              on={ON.PRIMARY}
              Icon={BiSidebar}
              className={className}
              onClick={handleNavButtonClick}
            />
          </div>
        )}
        <div className="flex-none">
          <button className="block w-12 h-12 bg-cover bg-background bg-center rounded overflow-hidden border border-on-primary-slight hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-on-primary focus:opacity-75 active:opacity-75">
            {thumbnail}
          </button>
        </div>
        <div className="flex-none">
          <div className="text-xs font-bold  text-on-primary">
            {endpoint.id}
          </div>
          <div className="text-sm font-bold text-on-primary-high">
            {document.info.title}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
