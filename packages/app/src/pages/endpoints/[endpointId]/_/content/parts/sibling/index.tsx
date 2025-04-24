import React, { useCallback, useMemo, useState } from 'react';
import Request from '~/components/request';
import { BaseError } from '~/errors/index';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, RequestValue } from '~/types/oas';
import { UseSiblingsReturn } from '../../hooks/useSiblings';
import Action from '../action';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export type Props = {
  endpoint: Endpoint;
  document: Document;
  sibling: UseSiblingsReturn[number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOperationSuccess: (data: any) => void;
  onOperationFail: (error: BaseError) => void;
};
const Sibling: React.FC<Props> = ({
  endpoint,
  document,
  sibling,
  onOperationSuccess,
  onOperationFail,
}) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleRequestSubmit = useCallback(
    async (requestValue: RequestValue) => {
      setOpen(false);
      setIsPending(true);
      const { data, error } = await sibling.fetch(requestValue);
      setIsPending(false);
      if (data) {
        onOperationSuccess(data);
      }
      if (error) {
        onOperationFail(error);
      }
    },
    [sibling, onOperationSuccess, onOperationFail]
  );

  const label = useMemo<string>(() => {
    const { operation } = sibling.request;
    if (operation.summary) {
      return operation.summary;
    }
    return operation.operationId || sibling.request.method;
  }, [sibling]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Action disabled={isPending} request={sibling.request} label={label} />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{label}</SheetTitle>
        </SheetHeader>
        <Request
          on={COLOR_SYSTEM.SURFACE}
          endpoint={endpoint}
          document={document}
          request={sibling.request}
          defaultValues={sibling.defaultValues}
          onSubmit={handleRequestSubmit}
          className="h-full"
        />
      </SheetContent>
    </Sheet>
  );
};

export default Sibling;
