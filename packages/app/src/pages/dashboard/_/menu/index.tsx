import React from 'react';
import MoreIcon from '~/components/icon/more/outline';
import Popover, { usePopover } from '~/portals/popover';
import { ClassName } from '~/types';
import Export from './export';
import Import from './import';

type Props = {
  className?: ClassName;
};
const Menu: React.FC<Props> = ({ className }) => {
  const menuPopover = usePopover<HTMLDivElement>();

  return (
    <>
      <div className={className}>
        <div ref={menuPopover.targetRef}>
          {/* TODO: Add this as component*/}
          <button
            className="p-1 hover:bg-thm-on-background-slight text-2xl rounded text-bg-thm-on-background"
            onClick={menuPopover.open}
          >
            <MoreIcon />
          </button>
        </div>
      </div>
      {/* Menu */}
      <Popover.renewal {...menuPopover.bind}>
        <ul className="space-y-2">
          <li>
            <Import />
          </li>
          <li>
            <Export />
          </li>
        </ul>
      </Popover.renewal>
    </>
  );
};
export default Menu;
