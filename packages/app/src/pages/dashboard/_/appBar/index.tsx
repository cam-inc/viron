import React, { useCallback } from 'react';
import MenuAlt1Icon from '~/components/icon/menuAlt1/outline';
import { Button } from '~/components/ui/button';
import { Props as LayoutProps } from '~/layouts';

type Props = Parameters<NonNullable<LayoutProps['renderAppBar']>>[0];
const Appbar: React.FC<Props> = ({ className, style, openNavigation }) => {
  const handleNavButtonClick = useCallback(() => {
    openNavigation();
  }, [openNavigation]);

  return (
    <div className={className} style={style}>
      <div className="flex items-center h-full px-4">
        <Button variant="ghost" size="icon" onClick={handleNavButtonClick}>
          <MenuAlt1Icon />
        </Button>
      </div>
    </div>
  );
};
export default Appbar;
