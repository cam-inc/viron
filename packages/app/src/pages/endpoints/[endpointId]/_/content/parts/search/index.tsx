import { SearchIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import Request from '~/components/request';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, RequestValue } from '~/types/oas';
import { UseBaseReturn } from '../../hooks/useBase';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export type Props = {
  endpoint: Endpoint;
  document: Document;
  base: UseBaseReturn;
};
const Search: React.FC<Props> = ({ endpoint, document, base }) => {
  const [open, setOpen] = useState(false);
  const handleRequestSubmit = useCallback(
    (requestValue: RequestValue) => {
      setOpen(false);
      base.fetch(requestValue);
    },
    [base]
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setOpen(true)}
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Search</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Search</SheetTitle>
        </SheetHeader>
        <Request
          on={COLOR_SYSTEM.SURFACE}
          endpoint={endpoint}
          document={document}
          request={base.request}
          defaultValues={base.requestValue}
          onSubmit={handleRequestSubmit}
          className="h-full"
        />
      </SheetContent>
    </Sheet>
  );
};
export default Search;
