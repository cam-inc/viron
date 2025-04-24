import React, { useCallback, useMemo, useState } from 'react';
import Request from '~/components/request';
import { BaseError } from '~/errors';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, RequestValue } from '~/types/oas';
import { UseDescendantsReturn } from '../../hooks/useDescendants';
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
  descendant: UseDescendantsReturn[number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOperationSuccess: (data: any) => void;
  onOperationFail: (error: BaseError) => void;
};
const Descendant: React.FC<Props> = ({
  endpoint,
  document,
  descendant,
  data,
  onOperationSuccess,
  onOperationFail,
}) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleRequestSubmit = useCallback(
    async (requestValue: RequestValue) => {
      setOpen(false);
      setIsPending(true);
      const { data, error } = await descendant.fetch(requestValue);
      setIsPending(false);
      if (data) {
        onOperationSuccess(data);
      }
      if (error) {
        onOperationFail(error);
      }
    },
    [descendant, onOperationSuccess, onOperationFail]
  );

  const label = useMemo<string>(() => {
    const { operation } = descendant.request;
    if (operation.summary) {
      return operation.summary;
    }
    return operation.operationId || descendant.request.method;
  }, [descendant]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Action
          disabled={isPending}
          request={descendant.request}
          label={label}
        />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{label}</SheetTitle>
        </SheetHeader>
        <Request
          on={COLOR_SYSTEM.SURFACE}
          endpoint={endpoint}
          document={document}
          request={descendant.request}
          defaultValues={descendant.getDefaultValues(data)}
          onSubmit={handleRequestSubmit}
          className="h-full"
        />
      </SheetContent>
    </Sheet>
  );
};
export default Descendant;
