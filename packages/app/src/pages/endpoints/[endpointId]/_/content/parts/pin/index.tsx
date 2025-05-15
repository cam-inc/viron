import { PinIcon, PinOffIcon } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

export type Props = {
  isActive: boolean;
  onClick: () => void;
};
const Pin: React.FC<Props> = ({ isActive, onClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="h-8 w-8" onClick={onClick}>
            {isActive ? (
              <PinOffIcon className="h-4 w-4" />
            ) : (
              <PinIcon className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isActive ? 'Unpin' : 'Pin'}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export default Pin;
