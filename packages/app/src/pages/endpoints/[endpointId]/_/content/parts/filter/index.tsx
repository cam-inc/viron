import { AiFillFilter } from '@react-icons/all-files/ai/AiFillFilter';
import { AiOutlineFilter } from '@react-icons/all-files/ai/AiOutlineFilter';
import classnames from 'classnames';
import React, { useCallback } from 'react';
import TextButton, { Props as TextButtonProps } from '~/components/button/text';
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
  const handleButtonClick = useCallback<TextButtonProps['onClick']>(() => {
    drawer.open();
  }, [drawer]);

  const handleItemClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!base.filter.enabled) {
        return;
      }
      const key = e.currentTarget.dataset.key as string;
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
        <TextButton
          cs={COLOR_SYSTEM.PRIMARY}
          Icon={base.filter.filtered ? AiFillFilter : AiOutlineFilter}
          onClick={handleButtonClick}
        />
      </div>
      <Drawer {...drawer.bind}>
        <div className="h-full flex flex-col text-thm-on-surface">
          {/* Head */}
          <div className="flex-none p-2 border-b-2 border-thm-on-surface-faint">
            <div>Filter</div>
          </div>
          {/* Body */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="px-2 pb-2 flex-1 min-h-0 overflow-y-scroll overscroll-y-contain">
              <div className="flex flex-col">
                {base.filter.list.map((item) => (
                  <button
                    key={item.key}
                    data-key={item.key}
                    className={classnames(
                      'py-2 flex items-center gap-2 border-b border-thm-on-surface-faint',
                      {
                        'text-thm-on-surface': item.isActive,
                        'text-thm-on-surface-slight': !item.isActive,
                      }
                    )}
                    onClick={handleItemClick}
                  >
                    <div>{item.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Tail */}
          <div className="flex-none p-2 border-t-2 border-thm-on-surface-faint">
            <button className="w-full" onClick={handleApplyClick}>
              apply
            </button>
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
