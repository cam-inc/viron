import React, { useCallback, useState } from 'react';
import Request from '~/components/request';
import { BaseError } from '~/errors';
import Drawer, { useDrawer } from '~/portals/drawer';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document, RequestValue } from '~/types/oas';
import Action from '../action';
import { UseDescendantsReturn } from '../../hooks/useDescendants';

export type Props = {
  endpoint: Endpoint;
  document: Document;
  descendant: UseDescendantsReturn[number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOperationSuccess: (data: any) => void;
  onOperationFail: (error: BaseError) => void;
  onClick?: () => void;
};
const Descendant: React.FC<Props> = ({
  endpoint,
  document,
  descendant,
  data,
  onOperationSuccess,
  onOperationFail,
  onClick,
}) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const drawer = useDrawer();
  const handleClick = useCallback(() => {
    if (isPending) {
      return;
    }
    drawer.open();
    onClick?.();
  }, [drawer, isPending, onClick]);

  const handleRequestSubmit = useCallback(
    async (requestValue: RequestValue) => {
      drawer.close();
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
    [drawer, descendant, onOperationSuccess, onOperationFail]
  );

  return (
    <>
      <Action request={descendant.request} onClick={handleClick} />
      <Drawer {...drawer.bind}>
        <Request
          on={COLOR_SYSTEM.SURFACE}
          endpoint={endpoint}
          document={document}
          request={descendant.request}
          defaultValues={descendant.getDefaultValues(data)}
          onSubmit={handleRequestSubmit}
          className="h-full"
        />
      </Drawer>
    </>
  );
};
export default Descendant;
