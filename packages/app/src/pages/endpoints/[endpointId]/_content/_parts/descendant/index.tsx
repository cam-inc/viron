import React, { useState } from 'react';
import Drawer, { useDrawer } from '$components/drawer';
import RequestComponent from '$components/request';
import { RequestValue } from '$types/oas';
import { UseDescendantsReturn } from '../../_hooks/useDescendants';

type Props = {
  descendant: UseDescendantsReturn[number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOperationSuccess: (data: any) => void;
  onOperationFail: (error: Error) => void;
};
const Descendant: React.FC<Props> = ({
  descendant,
  data,
  onOperationSuccess,
  onOperationFail,
}) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const drawer = useDrawer();
  const handleClick = function () {
    drawer.open();
  };

  const handleRequestSubmit = async function (requestValue: RequestValue) {
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
  };

  return (
    <>
      <button onClick={handleClick}>
        {descendant.request.operation.operationId}
        {isPending && <span>(pending...)</span>}
      </button>
      <Drawer {...drawer.bind}>
        <RequestComponent
          request={descendant.request}
          defaultValues={descendant.getDefaultValues(data)}
          onSubmit={handleRequestSubmit}
        />
      </Drawer>
    </>
  );
};
export default Descendant;
