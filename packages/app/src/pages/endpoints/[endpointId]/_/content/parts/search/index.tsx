import { Search as SearchIcon } from 'lucide-react';
import React, { useCallback } from 'react';
import Request from '~/components/request';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import Drawer, { useDrawer } from '~/portals/drawer';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, RequestValue } from '~/types/oas';
import { UseBaseReturn } from '../../hooks/useBase';
import { Button } from '@/components/ui/button';

export type Props = {
  endpoint: Endpoint;
  document: Document;
  base: UseBaseReturn;
};
const Search: React.FC<Props> = ({ endpoint, document, base }) => {
  const drawer = useDrawer();
  const handleRequestSubmit = useCallback(
    (requestValue: RequestValue) => {
      drawer.close();
      base.fetch(requestValue);
    },
    [drawer, base]
  );

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              className="h-8 w-8"
              onClick={() => {
                drawer.open();
              }}
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-thm-on-surface whitespace-nowrap">Search</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Drawer {...drawer.bind}>
        <Request
          on={COLOR_SYSTEM.SURFACE}
          endpoint={endpoint}
          document={document}
          request={base.request}
          defaultValues={base.requestValue}
          onSubmit={handleRequestSubmit}
          className="h-full"
        />
      </Drawer>
    </>
  );
};
export default Search;
