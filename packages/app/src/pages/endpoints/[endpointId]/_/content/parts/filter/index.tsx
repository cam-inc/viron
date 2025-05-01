import {
  FunnelIcon,
  FunnelPlusIcon,
  LightbulbIcon,
  LightbulbOffIcon,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { Document, Content } from '~/types/oas';
import { UseBaseReturn } from '../../hooks/useBase';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export type Props = {
  document: Document;
  content: Content;
  base: UseBaseReturn;
};
const Filter: React.FC<Props> = ({ base }) => {
  const [open, setOpen] = useState(false);

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
    setOpen(false);
  }, []);

  if (!base.filter.enabled) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {base.filter.filtered ? (
              <Button
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setOpen(true)}
              >
                <FunnelPlusIcon className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setOpen(true)}
              >
                <FunnelIcon className="h-4 w-4" />
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent>Filter</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
          <SheetDescription>Select items to show.</SheetDescription>
        </SheetHeader>
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
                      <LightbulbIcon className="h-4 w-4" />
                    ) : (
                      <LightbulbOffIcon className="h-4 w-4" />
                    )}
                    {item.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Tail */}
        <div className="flex-none flex justify-end p-2 border-t-2 border-border">
          <Button variant="default" onClick={handleApplyClick}>
            Apply
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default Filter;
