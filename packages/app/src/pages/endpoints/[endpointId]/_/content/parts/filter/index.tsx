import { Funnel, FunnelPlus, Lightbulb, LightbulbOff } from 'lucide-react';
import React, { useCallback } from 'react';
import Head from '~/components/head';
import { Button } from '~/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import Drawer, { useDrawer } from '~/portals/drawer';
import { usePopover } from '~/portals/popover';
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

  const handleItemClick = useCallback(
    (key: string) => {
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {base.filter.filtered ? (
                <Button
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => {
                    drawer.open();
                  }}
                >
                  <FunnelPlus className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => {
                    drawer.open();
                  }}
                >
                  <Funnel className="h-4 w-4" />
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-thm-on-surface">Filter</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Drawer {...drawer.bind}>
        <div className="h-full flex flex-col text-thm-on-surface">
          {/* Head */}
          <div className="flex-none p-2 border-b-2 border-thm-on-surface-faint">
            <Head
              on={COLOR_SYSTEM.SURFACE}
              title="Filter"
              description="Select items to show."
            />
          </div>
          {/* Body */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="px-2 py-2 flex-1 min-h-0 overflow-y-scroll overscroll-y-contain">
              <ul className="space-y-2">
                {base.filter.list.map((item) => (
                  <li key={item.key}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        handleItemClick(item.key);
                      }}
                    >
                      {item.isActive ? (
                        <Lightbulb className="h-4 w-4" />
                      ) : (
                        <LightbulbOff className="h-4 w-4" />
                      )}
                      {item.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Tail */}
          <div className="flex-none flex justify-end p-2 border-t-2 border-thm-on-surface-faint">
            <Button variant="default" onClick={handleApplyClick}>
              Apply
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
};
export default Filter;
