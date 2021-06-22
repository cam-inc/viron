import React, { useState } from 'react';
import Drawer, { useDrawer } from '$components/drawer';
import RequestComponent from '$components/request';
import { RequestValue } from '$types/oas';
import { UseSiblingsReturn } from '../../_hooks/useSiblings';

type Props = {
  sibling: UseSiblingsReturn[number];
  onOperationSuccess: (data: any) => void;
  onOperationFail: (error: Error) => void;
};
const Sibling: React.FC<Props> = ({
  sibling,
  onOperationSuccess,
  onOperationFail,
}) => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const drawer = useDrawer();
  const handleClick = function () {
    drawer.open();
  };

  const handleRequestSubmit = async function (requestValue: RequestValue) {
    drawer.requestClose();
    setIsPending(true);
    const { data, error } = await sibling.fetch(requestValue);
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
        {sibling.request.operation.operationId}
        {isPending && <span>(pending...)</span>}
      </button>
      <Drawer {...drawer.bind}>
        <RequestComponent
          request={sibling.request}
          defaultValues={sibling.defaultValues}
          onSubmit={handleRequestSubmit}
        />
      </Drawer>
    </>
  );
};

export default Sibling;
