import React, { useCallback } from 'react';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import TextOnButton, {
  Props as TextOnButtonProps,
} from '~/components/button/text/on';
import Head from '~/components/head';
import BulbOutlineIcon from '~/components/icon/bulb/outline';
import BulbSolidIcon from '~/components/icon/bulb/solid';
import FilterOutlineIcon from '~/components/icon/filter/outline';
import FilterSolidIcon from '~/components/icon/filter/solid';
import Drawer, { useDrawer } from '~/portals/drawer';
import Popover, { usePopover } from '~/portals/popover';
import { COLOR_SYSTEM } from '~/types';
import { Document, Content } from '~/types/oas';
import { UseBaseReturn } from '../../hooks/useBase';

export type Props = {
  document: Document;
  content: Content;
  base: UseBaseReturn;
};
const Filter: React.FC<Props> = ({ base }) => {
  const popover = usePopover<HTMLDivElement>();
  const handleMouseEnter = useCallback(() => {
    popover.open();
  }, [popover]);
  const handleMouseLeave = useCallback(() => {
    popover.close();
  }, [popover]);

  const drawer = useDrawer();
  const handleButtonClick = useCallback<
    TextOnButtonProps['onClick'] | FilledButtonProps['onClick']
  >(() => {
    drawer.open();
  }, [drawer]);

  const handleItemClick = useCallback<TextOnButtonProps<string>['onClick']>(
    (key) => {
      if (!base.filter.enabled) {
        return;
      }
      base.filter.toggle(key);
    },
    [base]
  );

  const handleApplyClick = useCallback(() => {
    drawer.close();
  }, [drawer]);

  if (!base.filter.enabled) {
    return null;
  }

  return (
    <>
      <div
        ref={popover.targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {base.filter.filtered ? (
          <FilledButton
            cs={COLOR_SYSTEM.PRIMARY}
            Icon={FilterSolidIcon}
            onClick={handleButtonClick}
          />
        ) : (
          <TextOnButton
            on={COLOR_SYSTEM.SURFACE}
            Icon={FilterOutlineIcon}
            onClick={handleButtonClick}
          />
        )}
      </div>
      <Drawer {...drawer.bind}>
        <div className="h-full flex flex-col text-thm-on-surface">
          {/* Head */}
          <div className="flex-none p-2 border-b-2 border-thm-on-surface-faint">
            <Head
              on={COLOR_SYSTEM.SURFACE}
              title="Filter"
              description="TODO: select items."
            />
          </div>
          {/* Body */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="px-2 pb-2 flex-1 min-h-0 overflow-y-scroll overscroll-y-contain">
              <ul className="space-y-2">
                {base.filter.list.map((item) => (
                  <li key={item.key}>
                    <TextOnButton<string>
                      className="block w-full"
                      on={COLOR_SYSTEM.SURFACE}
                      data={item.key}
                      label={item.name}
                      Icon={item.isActive ? BulbSolidIcon : BulbOutlineIcon}
                      onClick={handleItemClick}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Tail */}
          <div className="flex-none p-2 border-t-2 border-thm-on-surface-faint">
            <FilledButton
              cs={COLOR_SYSTEM.PRIMARY}
              label="Apply"
              onClick={handleApplyClick}
            />
          </div>
        </div>
      </Drawer>
      <Popover {...popover.bind}>
        <div className="text-on-surface">Filter</div>
      </Popover>
    </>
  );
};
export default Filter;
