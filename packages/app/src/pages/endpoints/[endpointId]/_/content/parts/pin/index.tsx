import { Pin as PinIcon, PinOff as PinOffIcon } from 'lucide-react';
import React from 'react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '~/components/ui/tooltip';
import { Button } from '@/components/ui/button';

export type Props = {
  isActive: boolean;
  onClick: () => void;
};
const Pin: React.FC<Props> = ({ isActive, onClick }) => {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="ghost" className="h-8 w-8" onClick={onClick}>
              {isActive ? (
                <PinOffIcon className="h-4 w-4" />
              ) : (
                <PinIcon className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-thm-on-surface">
              {isActive ? 'Unpin' : 'Pin'}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};
export default Pin;
