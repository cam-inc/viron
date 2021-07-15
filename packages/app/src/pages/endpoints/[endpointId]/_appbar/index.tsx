import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import Logo from '$components/logo';
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
  console.log(endpoint, document);

  const [screen] = useRecoilState(screenState);
  const { lg } = screen;

  const handleLogoClick = useCallback(
    function () {
      openNavigation();
    },
    [openNavigation]
  );

  return (
    <div className={className}>
      <div className="flex justify-center items-center h-full px-4">
        {!lg && (
          <div className="flex-none mr-2">
            <Logo
              className="h-8"
              left="text-on-complementary"
              right="text-on-complementary-variant"
              onClick={handleLogoClick}
            />
          </div>
        )}
        <div className="flex-none">
          <div className="font-bold text-on-primary-high">
            {document.info.title}
          </div>
          <div className="text-xs text-on-primary">
            {document.info.description}
          </div>
        </div>
        <div className="flex-1 min-w-0" />
        <div className="flex-none">
          <div
            className="w-12 h-12 bg-cover bg-center rounded"
            style={{
              backgroundImage:
                'url(https://st0.fensi.plus/ui/common/favicon/owner/favicon-96x96.png)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Header;
