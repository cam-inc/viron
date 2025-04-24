import { RefreshCwIcon } from 'lucide-react';
import React, { useCallback } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { UseBaseReturn } from '../../hooks/useBase';
import { Button } from '@/components/ui/button';

export type Props = {
  base: UseBaseReturn;
};
const Refresh: React.FC<Props> = ({ base }) => {
  const handleButtonClick = useCallback(() => {
    base.refresh();
  }, [base]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8"
            onClick={handleButtonClick}
          >
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Refresh</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export default Refresh;
