import classnames from 'classnames';
import { ServerIcon } from 'lucide-react';
import React from 'react';
import { Props as BaseProps } from '@/components';
import CommonMark from '@/components/commonMark';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Server } from '@/types/oas';

type Props = BaseProps & {
  server: Server;
};
const _Server: React.FC<Props> = ({ on, server, className = '' }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={classnames(
              'p-1 text-xs rounded border border-border',
              className
            )}
          >
            <div className="flex items-center gap-1">
              <ServerIcon className="w-em" />
              <div>{server.url}</div>
            </div>
          </div>
        </TooltipTrigger>
        {server.description && (
          <TooltipContent>
            <CommonMark on={on} data={server.description} />
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
export default _Server;
